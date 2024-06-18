import * as SphinxBot from "sphinx-bot";
import constants from "../constant";
import { BotMsg } from "../types";

export function buildBotPayload(
  msg: BotMsg,
  chat_pubkey: string,
  botPrefix?: string
): SphinxBot.Message {
  const m = <SphinxBot.Message>{
    id: msg.message.uuid,
    reply_id: msg.message.replyUuid,
    channel: {
      id: chat_pubkey,
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
    if (m.member)
      m.member.roles = [
        {
          name: "Admin",
        },
      ];
  }
  return m;
}
