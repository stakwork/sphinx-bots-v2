import * as SphinxBot from "sphinx-bot";
import { BotMsg } from "../types";
import { buildBotPayload } from "../controller/bots";

async function initializeAllBots() {}

function builtinBotEmit(msg: BotMsg, botPrefix?: string) {
  setTimeout(() => {
    SphinxBot._emit("message", buildBotPayload(msg, botPrefix));
  }, 1200);
}

export { initializeAllBots, builtinBotEmit, buildBotPayload };
