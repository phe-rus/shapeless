import fs from "fs-extra"
import path from "path"
import { type PackageJson } from "type-fest"

import { PKG_ROOT } from "@/constants.js"
import { type Installer } from "@/installers/index.js"
import { addPackageDependency } from "@/utils/add-package-dep.js"

export const drizzleInstaller: Installer = ({ projectDir, databaseProvider }) => {
  addPackageDependency({
    projectDir,
    dependencies: ["drizzle-kit", "eslint-plugin-drizzle"],
    devDependencies: true,
  })
  addPackageDependency({
    projectDir,
    dependencies: ["drizzle-orm"],
    devDependencies: false,
  })

  const extrasDir = path.join(PKG_ROOT, "template/extras")

  const routerSrc = path.join(extrasDir, `resources/routers/post/with-drizzle.ts`)
  const routerDest = path.join(projectDir, `resources/routers/post-router.ts`)

  const envSrc = path.join(extrasDir, `config/_env-drizzle`)
  const vercelPostgresEnvSrc = path.join(extrasDir, `config/_env-drizzle-vercel-postgres`)

  const envDest = path.join(projectDir, ".env")

  // add db:* scripts to package.json
  const packageJsonPath = path.join(projectDir, "package.json")

  const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson
  if (databaseProvider === "d1-http") {
    packageJsonContent.scripts = {
      ...packageJsonContent.scripts,
      "db:gen": "drizzle-kit generate",
      "db:local": "wrangler d1 migrations apply replacewithyourown --local",
      "db:remote": "wrangler d1 migrations apply replacewithyourown --remote",
      "db:studio": "drizzle-kit studio",
      "cf:gen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts",
      "cf:build": "opennextjs-cloudflare build",
      "cf:preview": "opennextjs-cloudflare preview",
      "cf:deploy": "opennextjs-cloudflare deploy",
      "cf:upload": "opennextjs-cloudflare build && opennextjs-cloudflare upload",
    }
  } else {
    packageJsonContent.scripts = {
      ...packageJsonContent.scripts,
      "db:push": "drizzle-kit push",
      "db:studio": "drizzle-kit studio",
      "db:generate": "drizzle-kit generate",
      "db:migrate": "drizzle-kit migrate",
    }
  }

  fs.copySync(routerSrc, routerDest)
  fs.copySync(databaseProvider === "vercel-postgres" ? vercelPostgresEnvSrc : envSrc, envDest)

  fs.writeJSONSync(packageJsonPath, packageJsonContent, {
    spaces: 2,
  })
}
