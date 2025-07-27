import appRouter from "@resources/index"
import { handle } from "hono/vercel"

// This route catches all incoming API requests and lets your appRouter handle them.
export const GET = handle(appRouter.handler)
export const POST = handle(appRouter.handler)
