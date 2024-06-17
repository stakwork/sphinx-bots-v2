import axios from "axios";
import { config } from "../config";
import logger from "../logger";
import { Action } from "../types";

export async function finalAction(a: Action): Promise<void> {
  logger.info(`Send message to mixer: ${JSON.stringify(a)}`);

  //Send via API
  if (config.mixer_url) {
    try {
      await axios.post(
        config.mixer_url,
        { ...a },
        { headers: { "x-secret": config.mixer_secret_key } }
      );
      logger.info("Action sent to Mixer successfully");
    } catch (error) {
      logger.error(`Error posting Action to Mixer: ${JSON.stringify(error)}`);
    }
  } else {
    logger.error("MIXER_URL is not set in environment variable");
  }
}
