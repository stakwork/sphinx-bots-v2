import express from "express";
import expressApp from "./loaders/express";
import { config } from "./config";
import { sequelize } from "./models";
import logger from "./logger";
import { initializeAllBots } from "./bots";

async function startServer() {
  const app = express();

  /**
   * Importing express app
   **/
  await expressApp({ app });
  app
    .listen(config.port, () => {
      sequelize
        .sync()
        .then(() => {
          initializeAllBots();
          logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
        })
        .catch(() => {});
    })
    .on("error", (err) => {
      logger.error(err);
      process.exit(1);
    });
}
startServer();
