import { env } from "@/libs";
import winston from "winston";

const Logger = winston.createLogger({
  level: "silly",
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
});

export default Logger;
