import { defineConfig } from "drizzle-kit"
import "dotenv/config"

export default defineConfig({
  out: "./drizzle",
  schema: "./resources/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
})
