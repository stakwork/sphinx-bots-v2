import logger from "../logger";
import { Action } from "../types";

export async function finalAction(a: Action): Promise<void> {
  logger.info(`Send message to mixer: ${JSON.stringify(a)}`);

  //Send via API
}
