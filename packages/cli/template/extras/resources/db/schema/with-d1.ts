import { sqliteTable, text, index } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"

export const posts = sqliteTable(
    "posts",
    {
        id: text("id").primaryKey().$default(() => nanoid(38)),
        name: text("name", { length: 255 }).notNull(),
        createdAt: text("createdAt").notNull().$default(() => new Date().toISOString()),
        updatedAt: text("updatedAt").notNull().$default(() => new Date().toISOString()),
    },
    (table) => [
        index("Post_name_idx").on(table.name)
    ]
)

export type postInsert = typeof posts.$inferInsert
export type postSelect = typeof posts.$inferSelect