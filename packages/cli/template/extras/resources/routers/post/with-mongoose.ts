import { z } from "zod"
import { desc } from "drizzle-orm"
import { posts } from "@resources/db/schema"
import { app, publicProcedure } from "../shapeless"

export const postRouter = app.router({
    recent: publicProcedure.query(async ({ c, ctx }) => {
        const { db } = ctx

        await dbConnect()
        const recentPost = await Post.find().sort({ createdAt: -1 })

        return c.superjson(recentPost ?? null)
    }),

    create: publicProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, c, input }) => {
            const { name } = input
            const { db } = ctx

            await dbConnect()
            const post = await Post.find().sort({ createdAt: -1 })


            return c.superjson(post)
        }),
})
