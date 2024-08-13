import axios from "axios";
import { config } from "../config";
import logger from "../logger";
import { Action } from "../types";

interface BroadcastBody {
  dest: string;
  amt_msat?: number;
  content?: string;
  is_tribe?: boolean;
  reply_uuid?: string;
  msg_type?: number;
}

interface Payload {
  body: BroadcastBody;
  route: string;
}

function toPayload(a: Action): Payload {
  return {
    route: "send",
    body: {
      dest: a.chat_pubkey,
      amt_msat: a.amount || 3000, // FIXME?
      is_tribe: true,
      content: a.content,
      reply_uuid: a.reply_uuid,
      msg_type: 25, // bot_res
    },
  };
}

export async function finalAction(a: Action): Promise<void> {
  logger.info(`Send message to bot: ${JSON.stringify(a)}`);

  if (!config.bot_url) {
    logger.error("BOT_URL is not set in environment variable");
    return;
  }
  try {
    const pld = toPayload(a);
    await axios.post(config.bot_url + "/" + pld.route, pld.body, {
      headers: { "x-admin-token": config.bot_admin_token },
    });
    logger.info("Action sent to Mixer Bot successfully");
  } catch (error) {
    logger.error(`Error posting Action to Mixer: ${JSON.stringify(error)}`);
  }
}
