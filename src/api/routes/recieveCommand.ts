import { Router, Request, Response, NextFunction } from "express";
import { success, failure } from "../../utils/response";
import logger from "../../logger";
import { builtinBotEmit } from "../../bots";

const route = Router();

export default (app: Router) => {
  app.use(route);

  route.post(
    "/bot_command/:chat_pubkey",
    async (req: Request, res: Response) => {
      const chat_pubkey = req.params.chat_pubkey as string;
      if (!chat_pubkey)
        return failure(res, 400, "please provide valid chat pubkey");
      try {
        builtinBotEmit(req.body, chat_pubkey);
        return success(res, 200, "bot message received successfully");
      } catch (error) {
        logger.error(JSON.stringify(error));
        return failure(res, 500, error);
      }
    }
  );
};
