import { Sequelize, type SequelizeOptions } from "sequelize-typescript";
import type { Dialect } from "sequelize";
import Bot, { BotRecord } from "./sql/bot";
import ChatBot, { ChatBotRecord } from "./sql/chatBot";

const dialect: Dialect = "sqlite";

const opts: SequelizeOptions = {
  dialect,
  storage: process.env.DB_PATH || "/Users/Shared/sphinx_v2_bot.db",
  models: [Bot, ChatBot],
};

const sequelize = new Sequelize(opts);
const models = sequelize.models;

export { sequelize, models, BotRecord, ChatBotRecord };
