import { createLogger, transports, format } from "winston";

const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    format.printf((info) => {
      return `[${info.level}] ${info.timestamp} ${info.message}`;
    })
  ),
});

export default logger;
