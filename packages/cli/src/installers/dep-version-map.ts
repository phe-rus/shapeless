/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
  // neon
  "@neondatabase/serverless": "^0.10.4",

  // vercel postgres
  "@vercel/postgres": "^0.10.0",

  // Drizzle
  "drizzle-kit": "^0.30.1",
  "drizzle-orm": "^0.39.0",
  "eslint-plugin-drizzle": "^0.2.3",
  "@planetscale/database": "^1.19.0",
  postgres: "^3.4.5",

  // D1 Database
  "better-sqlite3": "^12.2.0",
  "@types/better-sqlite3": "^7",

  // Opennextjs
  "@opennextjs/cloudflare": "^1",
  "mongoose": "^8",
  "@types/mongoose": "^5",


  // TailwindCSS
  tailwindcss: "^4.0.0",
  postcss: "^8.5.1",
  prettier: "^3.3.2",
  "prettier-plugin-tailwindcss": "^0.6.11",
} as const
export type AvailableDependencies = keyof typeof dependencyVersionMap
