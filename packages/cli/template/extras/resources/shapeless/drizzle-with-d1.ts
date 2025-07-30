import { drizzle } from "drizzle-orm/d1"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { shapeless } from "@shapelesss/core"

interface Env {
    Bindings: CloudflareEnv
}

export const app = shapeless.init<Env>()

/**
 * Type-safely injects database into all procedures
 * 
 * @see https://shapeless.pherus.org/docs/backend/middleware
 */
const databaseMiddleware = app.middleware(async ({ c, next }) => {
    const { env } = await getCloudflareContext({ async: true })

    const db = drizzle(env.DB)

    return await next({ db })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = app.procedure.use(databaseMiddleware)
