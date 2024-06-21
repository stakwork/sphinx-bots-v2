import * as Sphinx from "sphinx-bot";
import { finalAction } from "../controller/finalBotAction";
import constants from "../constant";
import logger from "../logger";
import {
  findBuiltInChatBot,
  hideCommandHandler,
  determineOwnerOnly,
} from "../utils/helper";

const msg_types = Sphinx.MSG_TYPE;

let initted = false;
const botPrefix = "/welcome";

export function init() {
  if (initted) return;
  initted = true;
  const commands = ["setmessage", "hide"];
  const client = new Sphinx.Client();
  client.login("_", finalAction);

  client.on(msg_types.MESSAGE, async (message: Sphinx.Message) => {
    const chatBot = await findBuiltInChatBot(message.channel.id, botPrefix);
    if (!chatBot) return;
    const arr = (message.content && message.content.split(" ")) || [];

    const isGroupJoin = message.type === constants.message_types.group_join;

    if (arr.length < 2 && !isGroupJoin) return;
    if (arr[0] !== "/welcome" && !isGroupJoin) return;
    const cmd = arr[1];

    if (isGroupJoin) {
      try {
        let meta = "Welcome to the tribe!";
        if (chatBot && chatBot.meta) {
          meta = chatBot.meta;
        }
        const resEmbed = new Sphinx.MessageEmbed()
          .setAuthor("WelcomeBot")
          .setDescription(meta);
        setTimeout(() => {
          message.channel.send({ embed: resEmbed });
        }, 2500);
        return;
      } catch (e) {
        logger.error(`WELCOME BOT ERROR ${e}`);
      }
    }

    const isAdmin = message.member.roles.find((role) => role.name === "Admin");
    if (!isAdmin) return;

    const tribePubkey = message.channel.id;
    switch (cmd) {
      case "setmessage":
        if (arr.length < 3) return;
        logger.info(`setmsg ${arr[2]}`);

        const chatBot = await findBuiltInChatBot(tribePubkey, "/welcome");

        if (!chatBot) return;
        const meta = arr.slice(2, arr.length).join(" ");
        await chatBot.update({ meta });
        const resEmbed = new Sphinx.MessageEmbed()
          .setAuthor("WelcomeBot")
          .setDescription("Your welcome message has been updated")
          .setOnlyOwner(await determineOwnerOnly(botPrefix, cmd, tribePubkey));
        message.channel.send({ embed: resEmbed });
        return;
      case "hide":
        await hideCommandHandler(
          arr[2],
          commands,
          tribePubkey,
          message,
          "WelcomeBot",
          "/welcome"
        );
        return;
      default:
        const embed = new Sphinx.MessageEmbed()
          .setAuthor("WelcomeBot")
          .setTitle("Bot Commands:")
          .addFields([
            {
              name: "Set welcome message",
              value: "/welcome setmessage {MESSAGE}",
            },
            { name: "Help", value: "/welcome help" },
          ])
          .setThumbnail(botSVG);
        message.channel.send({ embed });
        return;
    }
  });
}

const botSVG = `<svg viewBox="64 64 896 896" height="12" width="12" fill="white">
  <path d="M300 328a60 60 0 10120 0 60 60 0 10-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 10120 0 60 60 0 10-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
</svg>`;
