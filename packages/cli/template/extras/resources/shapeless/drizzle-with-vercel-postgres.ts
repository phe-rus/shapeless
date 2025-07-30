import { sql } from "@vercel/postgres"
import { drizzle } from "drizzle-orm/vercel-postgres"
import { shapeless } from "@shapelesss/core"

interface Env {
  Bindings: { POSTGRES_URL: string }
}

export const app = shapeless.init<Env>()

/**
 * Type-safely injects database into all procedures
 * 
 * @see https://shapeless.pherus.org/docs/backend/middleware
 */
const databaseMiddleware = app.middleware(async ({ next }) => {
  // automatically reads POSTGRES_URL environment variable
  const db = drizzle(sql)

  return await next({ db })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = app.procedure.use(databaseMiddleware)
