import { logger } from "@/libs";
import expressLoader from "./express";
import { redisLoader } from "./redis";
import { socketLoader } from "./socket";
import type { Express } from "express";

export default async ({ expressApp }: { expressApp: Express }) => {
  try {
    console.log("Starting loader process...");

    // Ensure DB connection is established
    logger.info("✌️ DB loaded and connected!");

    // Dependency Injection logging
    logger.info("✌️ Dependency Injector loaded");

    // Apply express loader
    socketLoader({ app: expressApp });
    expressLoader({ app: expressApp });
    redisLoader();

    // Log after express loader
    logger.info("✌️ Express loaded");
  } catch (error) {
    console.error("Error in loader process:", error);
    throw error;
  }
};
