import { Sequelize } from "sequelize-typescript";
import * as path from "path";
import { readFileSync } from "fs";
import Bot, { BotRecord } from "./sql/bot";
import ChatBot, { ChatBotRecord } from "./sql/chatBot";

const configFile = path.join(__dirname, "../../config/config.json");
const env = process.env.NODE_ENV || "development";
const config = JSON.parse(readFileSync(configFile).toString())[env];

const opts = {
  ...config,
  models: [Bot, ChatBot],
};

const sequelize = new Sequelize(opts);
const models = sequelize.models;

export { sequelize, models, BotRecord, ChatBotRecord };
