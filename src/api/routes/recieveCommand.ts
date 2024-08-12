import { Router, Request, Response, NextFunction } from "express";
import { success, failure } from "../../utils/response";
import logger from "../../logger";
import { builtinBotEmit } from "../../bots";
import { Action, Msg, BotMsg } from "../../types";
import constants from "../../constant";
import { models, BotRecord } from "../../models";
import axios from "axios";
import { config } from "../../config";

const route = Router();

export default (app: Router) => {
  app.use(route);

  route.post("/action", async (req: Request, res: Response) => {
    try {
      const action = req.body as Action;
      if (!action) {
        return failure(res, 404, "no action");
      }
      // find bot by id and match secret???
      if (!action.bot_id) return failure(res, 404, "no bot_id");
      const bot: BotRecord = (await models.Bot.findOne({
        where: { id: action.bot_id },
      })) as BotRecord;
      if (!bot) return failure(res, 404, "no bot");
      if (action.bot_secret) {
        if (!(bot.secret && bot.secret === action.bot_secret)) {
          return failure(res, 401, "wrong secret");
        }
      }
      const botmsg = actionToBotMsg(action);
      builtinBotEmit(botmsg);
      return success(res, 200, "bot message received successfully");
    } catch (error) {
      logger.error(JSON.stringify(error));
      return failure(res, 500, error);
    }
  });

  route.post("/msg", async (req: Request, res: Response) => {
    const msg_token = req.headers["x-msg-token"];
    if (!msg_token) return failure(res, 401, "no msg token");
    if (msg_token !== process.env.MSG_TOKEN) {
      return failure(res, 401, "wrong msg token");
    }
    try {
      // console.log("=>", req.body);
      builtinBotEmit(req.body as Msg);
      return success(res, 200, "bot message received successfully");
    } catch (error) {
      logger.error(JSON.stringify(error));
      return failure(res, 500, error);
    }
  });

  route.get("/bot_pubkey", async (req: Request, res: Response) => {
    const msg_token = req.headers["x-msg-token"];
    if (!msg_token) return failure(res, 401, "no msg token");
    if (msg_token !== process.env.MSG_TOKEN) {
      return failure(res, 401, "wrong msg token");
    }
    try {
      const botres = await axios.get(config.bot_url + "/account", {
        headers: { "x-admin-token": config.bot_admin_token },
      });
      const data: AccountRes = botres.data;
      const pubkey = data.contact_info.split("_")[0];
      return res.status(200).json({ pubkey });
    } catch (error) {
      logger.error(JSON.stringify(error));
      return failure(res, 500, error);
    }
  });
};

export interface AccountRes {
  contact_info: string;
  alias: string;
  img: string;
  network: string;
}

function actionToBotMsg(a: Action): BotMsg {
  const data: BotMsg = {
    action: a.action,
    bot_id: a.bot_id,
    bot_name: a.bot_name,
    type: constants.message_types.bot_res,
    uuid: a.msg_uuid || "",
    message: {
      content: a.content || "",
      amount: a.amount || 0,
    },
    sender: {
      pubkey: a.chat_uuid,
      alias: a.bot_name || "",
      role: constants.tribe_roles.reader,
      route_hint: a.route_hint,
    },
  };
  if (a.recipient_id) {
    data.recipient_id = a.recipient_id;
  }
  if (a.reply_uuid) {
    data.message.replyUuid = a.reply_uuid;
  }
  if (a.parent_id) {
    data.message.parentId = a.parent_id;
  }
  return data;
}
