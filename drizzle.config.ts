// Correct (ES Modules)
import { env } from "@/libs";
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/schema",
  out: "./migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
} satisfies Config;
