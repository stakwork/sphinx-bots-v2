import * as Sphinx from "sphinx-bot";
import constants from "../constant";
import logger from "../logger";
import { ChatBotRecord, models } from "../models";

export async function findBuiltInChatBot(
  pubkey: string,
  botPrefix: string
): Promise<ChatBotRecord | null> {
  try {
    return (await models.ChatBot.findOne({
      where: {
        chatPubkey: pubkey,
        botPrefix: botPrefix,
        botType: constants.bot_types.builtin,
      },
    })) as ChatBotRecord;
  } catch (error) {
    logger.error(`Error finding BuiltInChatBot: ${JSON.stringify(error)}`);
    return null;
  }
}

export async function determineOwnerOnly(
  botPrefix: string,
  command: string,
  tribePubkey: string
): Promise<boolean> {
  try {
    const getBot = await findBuiltInChatBot(tribePubkey, botPrefix);
    if (
      getBot &&
      getBot.hiddenCommands &&
      JSON.parse(getBot.hiddenCommands).includes(command)
    ) {
      return true;
    }
    return false;
  } catch (error) {
    logger.error(
      `Error determining if bit is Owner Only: ${JSON.stringify(error)}`
    );
    return false;
  }
}

export async function hideCommandHandler(
  hideCommand: string,
  commands: string[],
  tribePubkey: string,
  message: Sphinx.Message,
  botName: string,
  botPrefix: string
): Promise<void> {
  if (!hideCommand) {
    const embed = new Sphinx.MessageEmbed()
      .setAuthor(botName)
      .setDescription("Please provide a valid command you would like to hide")
      .setOnlyOwner(await determineOwnerOnly(botPrefix, "hide", tribePubkey));
    message.channel.send({ embed });
    return;
  }

  if (!commands.includes(hideCommand)) {
    const embed = new Sphinx.MessageEmbed()
      .setAuthor(botName)
      .setDescription("Command is not valid")
      .setOnlyOwner(await determineOwnerOnly(botPrefix, "hide", tribePubkey));
    message.channel.send({ embed });
    return;
  }

  const bot = await findBuiltInChatBot(tribePubkey, botPrefix);

  if (!bot) {
    const embed = new Sphinx.MessageEmbed()
      .setAuthor(botName)
      .setDescription("welcome bot does not exist for this tribe")
      .setOnlyOwner(await determineOwnerOnly(botPrefix, "hide", tribePubkey));
    message.channel.send({ embed });
    return;
  }

  if (!bot.hiddenCommands) {
    await bot.update({
      hiddenCommands: JSON.stringify([hideCommand]),
    });
    const embed = new Sphinx.MessageEmbed()
      .setAuthor(botName)
      .setDescription("Command was added successfully")
      .setOnlyOwner(await determineOwnerOnly(botPrefix, "hide", tribePubkey));
    message.channel.send({ embed });
    return;
  } else {
    const savedCommands = JSON.parse(bot.hiddenCommands);
    if (!savedCommands.includes(hideCommand)) {
      await bot.update({
        hiddenCommands: JSON.stringify([...savedCommands, hideCommand]),
      });
      const embed = new Sphinx.MessageEmbed()
        .setAuthor(botName)
        .setDescription("Command was added successfully")
        .setOnlyOwner(await determineOwnerOnly(botPrefix, "hide", tribePubkey));
      message.channel.send({ embed });
      return;
    } else {
      const embed = new Sphinx.MessageEmbed()
        .setAuthor(botName)
        .setDescription("Command was already added")
        .setOnlyOwner(await determineOwnerOnly(botPrefix, "hide", tribePubkey));
      message.channel.send({ embed });
      return;
    }
  }
}
