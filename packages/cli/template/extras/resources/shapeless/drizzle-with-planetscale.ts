import { drizzle } from "drizzle-orm/planetscale-serverless"
import { env } from "hono/adapter"
import { Client } from "@planetscale/database"
import { shapeless } from "@shapelesss/core"

interface Env {
  Bindings: { DATABASE_URL: string }
}

export const app = shapeless.init<Env>()

/**
 * Type-safely injects database into all procedures
 * 
 * @see https://jstack.app/docs/backend/middleware
 */
const databaseMiddleware = app.middleware(async ({ c, next }) => {
  const { DATABASE_URL } = env(c)

  const client = new Client({ url: DATABASE_URL })
  const db = drizzle(client)

  return await next({ db })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = app.procedure
export const publicProcedure = baseProcedure.use(databaseMiddleware)
