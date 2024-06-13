import express from "express";
import expressApp from "./loaders/express";
import { config } from "./config";
import logger from "./logger";

async function startServer() {
  const app = express();

  /**
   * Importing express app
   **/
  await expressApp({ app });
  app
    .listen(config.port, () => {
      logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      logger.error(err);
      process.exit(1);
    });
}
startServer();
