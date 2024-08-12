import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 8001),
  api: {
    prefix: "/api",
  },
  bot_admin_token: process.env.BOT_ADMIN_TOKEN,
  bot_url: process.env.BOT_URL,
};
