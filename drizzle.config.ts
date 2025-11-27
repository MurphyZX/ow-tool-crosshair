import { defineConfig } from "drizzle-kit"
import { config } from "dotenv";
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Create env.example → .env.local before running Drizzle.")
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: connectionString,
  },
})
