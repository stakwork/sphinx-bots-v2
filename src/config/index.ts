import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 8001),
  api: {
    prefix: "/api",
  },
  mixer_admin_token: process.env.MIXER_ADMIN_TOKEN,
  mixer_url: process.env.MIXER_URL,
};
