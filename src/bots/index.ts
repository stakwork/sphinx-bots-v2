import * as SphinxBot from "sphinx-bot";
import * as MotherBot from "./mother";
import * as WelcomeBot from "./welcome";
import { BotMsg } from "../types";
import constants from "../constant";

async function initializeAllBots() {
  MotherBot.init();
  WelcomeBot.init();
}

function builtinBotEmit(msg: BotMsg, botPrefix?: string) {
  setTimeout(() => {
    SphinxBot._emit("message", buildBotPayload(msg, botPrefix));
  }, 1200);
}

function buildBotPayload(msg: BotMsg, botPrefix?: string): SphinxBot.Message {
  const m = <SphinxBot.Message>{
    id: msg.uuid,
    reply_id: msg.message.replyUuid,
    channel: {
      id: msg.sender.pubkey, // id of the chat is the tribe pubkey
      send: function () {},
      pay: function () {},
    },
    content: msg.message.content,
    amount: msg.message.amount,
    type: msg.type,
    media_key: msg.message.mediaKey,
    media_token: msg.message.mediaToken,
    media_type: msg.message.mediaType,
    member: {
      id: msg.sender.id ? msg.sender.id + "" : "0",
      nickname: msg.sender.alias,
      roles: [],
    },
    author: { bot: botPrefix },
  };
  if (msg.sender.role === constants.tribe_roles.owner) {
    m.member.roles = [
      {
        name: "Admin",
      },
    ];
  }
  return m;
}

export { initializeAllBots, builtinBotEmit, buildBotPayload };
