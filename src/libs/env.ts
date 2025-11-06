import dotenv from "dotenv";
import { z } from "zod";

// process.env.NODE_ENV = process.env.NODE_ENV || "development";
// const envFound = dotenv.config({
//   path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
// });
if (process.env.NODE_ENV !== "production") {
  const envFound = dotenv.config();
  if (envFound.error) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

enum LogLevelEnum {
  SILLY = "silly",
  INFO = "info",
}

enum NODE_ENV_ENUM {
  TEST = "test",
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

const envSchema = z.object({
  NODE_ENV: z.nativeEnum(NODE_ENV_ENUM).default(NODE_ENV_ENUM.DEVELOPMENT),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  PASSWORD_SALT: z.coerce.number().default(10),
  LOG_LEVEL: z.nativeEnum(LogLevelEnum).default(LogLevelEnum.SILLY),
  API_PREFIX: z.string(),
  API_KEY_ALGO: z.string().default("H256"),
  API_KEY_SECRET: z.string(),
  ENCRYPTION_KEY: z.string(),
  DEFAULT_PASSWORD: z.string(),
  DEFAULT_OTP_CODE: z.string(),
});

export const env = envSchema.parse(process.env);
