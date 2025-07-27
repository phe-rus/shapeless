import { shapeless } from "@shapelesss/core"
import { drizzle } from "drizzle-orm/postgres-js"
import { env } from "hono/adapter"

interface Env {
  Bindings: { DATABASE_URL: string }
}

export const app = shapeless.init<Env>()

/**
 * Type-safely injects database into all procedures
 * @see https://jstack.app/docs/backend/middleware
 * 
 * For deployment to Cloudflare Workers
 * @see https://developers.cloudflare.com/workers/tutorials/postgres/
 */
const databaseMiddleware = app.middleware(async ({ c, next }) => {
  const { DATABASE_URL } = env(c)

  const db = drizzle(DATABASE_URL)

  return await next({ db })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = app.procedure.use(databaseMiddleware)
