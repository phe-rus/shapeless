import { app } from "./shapeless"
import { postRouter } from "./routers/post-router"

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = app
  .router()
  .basePath("/api")
  .use(app.defaults.cors)
  .onError(app.defaults.errorHandler)

/**
 * This is the main router for your server.
 * All routers in /routers should be added here manually.
 */
const appRouter = app.mergeRouters(api, {
  post: postRouter,
})

export type AppRouter = typeof appRouter

export default appRouter
