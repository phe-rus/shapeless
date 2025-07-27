import { z } from "zod"
import { desc } from "drizzle-orm"
import { postInsert, posts } from "@resources/db/schema"
import { app, publicProcedure } from "../shapeless"

export const postRouter = app.router({
  recent: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx

    const [recentPost] = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(1)

    return c.superjson(recentPost ?? null)
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, c, input }) => {
      const { name } = input
      const { db } = ctx

      const insertData: postInsert = {
        name: name
      }

      const post = await db.insert(posts).values(insertData)

      return c.superjson(post)
    }),
})
