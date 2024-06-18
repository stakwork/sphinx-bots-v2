import * as Sphinx from "sphinx-bot";
import { finalAction } from "../controller/finalBotAction";
// import { installBotAsTribeAdmin } from "../controllers/bots";
import { models } from "../models";
import constants from "../constant";

import logger from "../logger";
// import { GITBOT_UUID, getOrCreateGitBot } from "./git";
// import { ML_PREFIX, ML_BOTNAME } from "./ml";

const msg_types = Sphinx.MSG_TYPE;

const builtinBots = [
  {
    name: "welcome",
    description: "Send automated messages when a user joins tribe",
  },
  {
    name: "loopout",
    description: "Sends money to a bitcoin address",
  },
  {
    name: "git",
    description: "Get repo notifications from GitHub",
  },
  {
    name: "badge",
    description: "Track tribe activity and award badges",
  },
  {
    name: "callRecording",
    description: "Record and process tribe calls",
  },
  { name: "kick", description: "Kick users from the tribe" },
  { name: "sentiment", description: "Calculate sentiment scores" },
  { name: "jarvis", description: "Sends tribe messages for processing" },
  { name: "spam_gone", description: "Delete Users message as Spam" },
  //   ML_PREFIX.substring(1),
];

// else just message type
const builtInBotMsgTypes: { [key: string]: number[] } = {
  welcome: [
    constants.message_types.message,
    constants.message_types.group_join,
  ],
  badge: [
    constants.message_types.message,
    constants.message_types.boost,
    constants.message_types.direct_payment,
  ],
  kick: [constants.message_types.group_join, constants.message_types.message],
  jarvis: [
    constants.message_types.message,
    constants.message_types.boost,
    constants.message_types.attachment,
  ],
  //   [`${ML_PREFIX.substring(1)}`]: [
  //     constants.message_types.message,
  //     constants.message_types.attachment,
  //   ],
};

const builtInHiddenCmd: { [key: string]: string[] } = {
  callRecording: ["hide", "update"],
  kick: ["hide", "add", "remove"],
  sentiment: ["threshold", "timer", "url"],
  jarvis: ["link", "hide"],
  spam_gone: ["add", "list", "remove"],
  //   [`${ML_PREFIX.substring(1)}`]: ["url", "api_key", "kind", "add"],
};

const builtInBotNames: { [key: string]: string } = {
  welcome: "WelcomeBot",
  loopout: "LoopBot",
  git: "GitBot",
  badge: "BadgeBot",
  callRecording: "CallRecordingBot",
  kick: "KickBot",
  sentiment: "SentimentBot",
  jarvis: "JarvisBot",
  spam_gone: "SpamGoneBot",
  //   [`${ML_PREFIX.substring(1)}`]: ML_BOTNAME,
};

export const adminsOnlyBot = ["kick"];

export function init() {
  const client = new Sphinx.Client();
  client.login("_", finalAction);

  client.on(msg_types.MESSAGE, async (message: Sphinx.Message) => {
    console.log("MOTHERBOT GOT A MESSAGE", message);
    const arr = (message.content && message.content.split(" ")) || [];
    if (arr.length < 2) return;
    if (arr[0] !== "/bot") return;
    const cmd = arr[1];

    console.log(arr);

    const isAdmin = message.member.roles.find((role) => role.name === "Admin");
    if (!isAdmin) return;

    switch (cmd) {
      case "install":
        if (arr.length < 3) return;
        const botName = arr[2];

        if (findBuiltInBot(botName)) {
          // localbot
          logger.info(["MotherBot INSTALL", botName]);
          const chat_pubkey = message.channel.id;
          if (!chat_pubkey) return logger.error("=> motherbot no chat_pubkey");
          const existing = await checkBotExist(chat_pubkey, botName);
          if (existing) {
            const embed = new Sphinx.MessageEmbed()
              .setAuthor("MotherBot")
              .setDescription(botName + " already installed")
              .setOnlyOwner(adminsOnlyBot.includes(botName) || false);
            return message.channel.send({ embed });
          }
          const msgTypes = builtInBotMsgTypes[botName] || [
            constants.message_types.message,
          ];
          const defaultHiddenCommands = builtInHiddenCmd[botName] || ["hide"];
          const chatBot: { [k: string]: any } = {
            chatPubkey: chat_pubkey,
            botPrefix: "/" + botName,
            botType: constants.bot_types.builtin,
            msgTypes: JSON.stringify(msgTypes),
            pricePerUse: 0,
            hiddenCommands: JSON.stringify(defaultHiddenCommands),
          };
          //   if (botName === "git") {
          //     await getOrCreateGitBot(chat.tenant);
          //     chatBot.botUuid = GITBOT_UUID;
          //   }
          try {
            await models.ChatBot.create({ ...chatBot });
          } catch (error) {
            console.log(error);
          }
          const theName = builtInBotNames[botName] || "Bot";
          const embed = new Sphinx.MessageEmbed()
            .setAuthor("MotherBot")
            .setDescription(theName + " has been installed!")
            .setOnlyOwner(adminsOnlyBot.includes(botName) || false);
          message.channel.send({ embed });
        } else {
          const embed = new Sphinx.MessageEmbed()
            .setAuthor("MotherBot")
            .setDescription("No bot with that name")
            .setOnlyOwner(adminsOnlyBot.includes(botName) || false);
          message.channel.send({ embed });
        }
        return true;

      case "uninstall":
        if (arr.length < 3) return;
        const botName2 = arr[2];
        const chat_pubkey_2 = message.channel.id;
        if (chat_pubkey_2) return logger.error("=> motherbot no chat_pubkey");
        const existing2 = await models.ChatBot.findOne({
          where: {
            chatPubkey: chat_pubkey_2,
            botPrefix: "/" + botName2,
          },
        });
        if (existing2) {
          await existing2.destroy();
          const embed = new Sphinx.MessageEmbed()
            .setAuthor("MotherBot")
            .setDescription(botName2 + " has been removed")
            .setOnlyOwner(adminsOnlyBot.includes(botName2) || false);
          return message.channel.send({ embed });
        } else {
          const embed = new Sphinx.MessageEmbed()
            .setAuthor("MotherBot")
            .setDescription("Cant find a bot by that name")
            .setOnlyOwner(adminsOnlyBot.includes(botName2) || false);
          return message.channel.send({ embed });
        }

      case "search":
        if (arr.length < 2) return;
        const query = arr[2];
        const bots = await searchBots(query);
        if (bots.length === 0) {
          const embed = new Sphinx.MessageEmbed()
            .setAuthor("MotherBot")
            .setDescription("No bots found");
          return message.channel.send({ embed });
        }
        const embed3 = new Sphinx.MessageEmbed()
          .setAuthor("MotherBot")
          .setTitle("Bots:")
          .addFields(
            bots.map((b) => {
              const maxLength = 35;
              const value =
                b.description.length > maxLength
                  ? b.description.substr(0, maxLength) + "..."
                  : b.description;
              return { name: b.name, value };
            })
          )
          .setThumbnail(botSVG);
        message.channel.send({ embed: embed3 });
        return true;

      default:
        const embed = new Sphinx.MessageEmbed()
          .setAuthor("MotherBot")
          .setTitle("Bot Commands:")
          .addFields([
            { name: "Search for bots", value: "/bot search {SEARCH_TERM}" },
            { name: "Install a new bot", value: "/bot install {BOTNAME}" },
            { name: "Uninstall a bot", value: "/bot uninstall {BOTNAME}" },
            {
              name: "Hide bot command from tribe members",
              value: "/{BOTNAME} hide {COMMAND_TO_HIDE}",
            },
            { name: "Help", value: "/bot help" },
          ])
          .setThumbnail(botSVG);
        message.channel.send({ embed });
    }
  });
}

const botSVG = `<svg viewBox="64 64 896 896" height="16" width="16" fill="white">
  <path d="M300 328a60 60 0 10120 0 60 60 0 10-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 10120 0 60 60 0 10-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
</svg>`;

async function searchBots(q: string) {
  try {
    const bots = [];
    for (let i = 0; i < builtinBots.length; i++) {
      const builtinBot = builtinBots[i];
      if (builtinBot.name.includes(q)) {
        bots.push(builtinBot);
      }
    }
    return bots;
  } catch (e) {
    return [];
  }
}

async function checkBotExist(chat_pubkey: string, botName: string) {
  try {
    const bot = await models.ChatBot.findOne({
      where: {
        chatPubkey: chat_pubkey,
        botPrefix: "/" + botName,
      },
    });
    return bot;
  } catch (error) {
    logger.error(`Error checking bot in tribe: ${error}`);
    throw error;
  }
}

function findBuiltInBot(botname: string) {
  for (let i = 0; i < builtinBots.length; i++) {
    const bot = builtinBots[i];
    if (bot.name.toLowerCase().includes(botname.toLowerCase())) {
      return true;
    }
  }

  return false;
}
