import { shapeless } from "@shapelesss/core"

interface Env {
  Bindings: {}
}

export const app = shapeless.init<Env>()

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = app.procedure
