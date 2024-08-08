import * as SphinxBot from "sphinx-bot";
import * as MotherBot from "./mother";
import * as WelcomeBot from "./welcome";
import { BotMsg } from "../types";
import { buildBotPayload } from "../controller/bots";

async function initializeAllBots() {
  MotherBot.init();
  WelcomeBot.init();
}

function builtinBotEmit(msg: BotMsg, chat_pubkey: string, botPrefix?: string) {
  setTimeout(() => {
    SphinxBot._emit("message", buildBotPayload(msg, chat_pubkey, botPrefix));
  }, 1200);
}

export { initializeAllBots, builtinBotEmit, buildBotPayload };
