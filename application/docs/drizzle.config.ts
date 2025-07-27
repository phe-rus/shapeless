import { defineConfig } from "drizzle-kit"
import path from "path"
import fs from "fs"
import "dotenv/config"

export function LocalWranglerPath() {
    try {
        const basePath = path.resolve('.wrangler')
        const dbFile = fs
            .readdirSync(basePath, { encoding: 'utf-8', recursive: true })
            .find((f) => f.endsWith('.sqlite'))

        if (!dbFile) {
            throw new Error('.sqlite file not found')
        }

        const url = path.resolve(basePath, dbFile)
        return url
    } catch (e) {
        console.error(`Error ${e}`)
    }
}

export default defineConfig({
    out: "./drizzle",
    schema: "./resources/db/schema.ts",
    dialect: "sqlite",
    ...(process.env.NODE_ENV === 'production'
        ? {
            driver: 'd1-http',
            dbCredentials: {
                accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
                databaseId: process.env.CLOUDFLARE_DATABASE_ID,
                token: process.env.CLOUDFLARE_D1_API_TOKEN,
            },
        }
        : {
            dbCredentials: {
                url: LocalWranglerPath(),
            },
        }),
})
