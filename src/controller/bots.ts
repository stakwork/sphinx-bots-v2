import * as SphinxBot from "sphinx-bot";
import constants from "../constant";
import { BotMsg } from "../types";

export function buildBotPayload(
  msg: BotMsg,
  botPrefix?: string
): SphinxBot.Message {
  const chat_uuid = msg.chat && msg.chat.uuid;
  const m = <SphinxBot.Message>{
    id: msg.message.uuid,
    reply_id: msg.message.replyUuid,
    channel: {
      id: chat_uuid,
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
  if (msg.sender.role === constants.chat_roles.owner) {
    if (m.member)
      m.member.roles = [
        {
          name: "Admin",
        },
      ];
  }
  return m;
}