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
}

interface Payload {
  body: BroadcastBody;
  route: string;
}

function toPayload(a: Action): Payload {
  return {
    route: "send",
    body: {
      dest: a.chat_uuid,
      amt_msat: a.amount,
      is_tribe: true,
      content: a.content,
      reply_uuid: a.reply_uuid,
    },
  };
}

export async function finalAction(a: Action): Promise<void> {
  logger.info(`Send message to mixer: ${JSON.stringify(a)}`);

  if (!config.mixer_url) {
    logger.error("MIXER_URL is not set in environment variable");
    return;
  }
  try {
    const pld = toPayload(a);
    await axios.post(config.mixer_url + "/" + pld.route, pld.body, {
      headers: { "x-admin-token": config.mixer_secret_key },
    });
    logger.info("Action sent to Mixer successfully");
  } catch (error) {
    logger.error(`Error posting Action to Mixer: ${JSON.stringify(error)}`);
  }
}
