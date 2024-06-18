import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 8001),
  api: {
    prefix: "/api",
  },
  mixer_secret_key: process.env.MIXER_SECRET_KEY,
  mixer_url: process.env.MIXER_URL,
};
