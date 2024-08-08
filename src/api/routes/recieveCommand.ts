import { Router, Request, Response, NextFunction } from "express";
import { success, failure } from "../../utils/response";
import logger from "../../logger";
import { builtinBotEmit } from "../../bots";
import { Action, Msg, BotMsg } from "../../types";
import constants from "../../constant";
import { models, BotRecord } from "../../models";

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
      builtinBotEmit(botmsg, action.chat_uuid);
      return success(res, 200, "bot message received successfully");
    } catch (error) {
      logger.error(JSON.stringify(error));
      return failure(res, 500, error);
    }
  });

  route.post("/msg/:chat_pubkey", async (req: Request, res: Response) => {
    const chat_pubkey = req.params.chat_pubkey as string;
    if (!chat_pubkey)
      return failure(res, 400, "please provide valid chat pubkey");
    try {
      builtinBotEmit(req.body as Msg, chat_pubkey);
      return success(res, 200, "bot message received successfully");
    } catch (error) {
      logger.error(JSON.stringify(error));
      return failure(res, 500, error);
    }
  });
};

function actionToBotMsg(a: Action): BotMsg {
  const data: BotMsg = {
    action: a.action,
    bot_id: a.bot_id,
    bot_name: a.bot_name,
    type: constants.message_types.bot_res,
    message: {
      content: a.content || "",
      amount: a.amount || 0,
      uuid: a.msg_uuid || "",
    },
    sender: {
      pub_key: "",
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
