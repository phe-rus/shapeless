import fs from "fs-extra"
import path from "path"

import { PKG_ROOT } from "@/constants.js"
import { addPackageDependency } from "@/utils/add-package-dep.js"
import { Installer } from "./index.js"

export const d1Installer: Installer = ({ projectDir }) => {
    const extrasDir = path.join(PKG_ROOT, "template/extras")

    addPackageDependency({
        projectDir,
        dependencies: ["better-sqlite3", "@opennextjs/cloudflare"],
        devDependencies: false,
    })

    addPackageDependency({
        projectDir,
        dependencies: ["@types/better-sqlite3"],
        devDependencies: true,
    })

    const configFile = path.join(extrasDir, `config/drizzle-config-d1.ts`)
    const configDest = path.join(projectDir, "drizzle.config.ts")

    const opennextjsFile = path.join(extrasDir, `config/opennextjs.config.mjs`)
    const opennextjsDest = path.join(projectDir, "nextjs.config.mjs")

    const wranglerFile = path.join(extrasDir, `config/wrangler.jsonc`)
    const wranglerFileDest = path.join(projectDir, "wrangler.jsonc")

    const envVarFile = path.join(extrasDir, `config/_env-drizzle-cloudflare-d1`)
    const envVarFileDest = path.join(projectDir, ".dev.vars")

    const envFile = path.join(extrasDir, `config/_env-drizzle-cloudflare-d1`)
    const envFileDest = path.join(projectDir, ".env")

    const envDFile = path.join(extrasDir, `opennextjs/opennextjs-env.d.ts`)
    const envDFileDest = path.join(projectDir, "env.d.ts")

    const cloudflareEnvDFile = path.join(extrasDir, `opennextjs/cloudflare-env.d.ts`)
    const cloudflareEnvDFileDest = path.join(projectDir, "cloudflare-env.d.ts")

    const schemaSrc = path.join(extrasDir, "resources/db/schema", `with-d1.ts`)
    const schemaDest = path.join(projectDir, "resources/db/schema.ts")

    const jstackSrc = path.join(extrasDir, "resources/shapeless", `drizzle-with-d1.ts`)
    const jstackDest = path.join(projectDir, "resources/shapeless.ts")

    fs.ensureDirSync(path.dirname(configDest))
    fs.ensureDirSync(path.dirname(schemaDest))
    fs.ensureDirSync(path.dirname(jstackDest))

    fs.ensureDirSync(path.dirname(opennextjsDest))
    fs.ensureDirSync(path.dirname(envVarFileDest))
    fs.ensureDirSync(path.dirname(wranglerFileDest))

    fs.ensureDirSync(path.dirname(envFileDest))
    fs.ensureDirSync(path.dirname(envDFileDest))
    fs.ensureDirSync(path.dirname(cloudflareEnvDFileDest))

    fs.copySync(wranglerFile, wranglerFileDest)
    fs.copySync(envVarFile, envVarFileDest)
    fs.copySync(configFile, configDest)
    fs.copySync(schemaSrc, schemaDest)
    fs.copySync(jstackSrc, jstackDest)
    fs.copySync(opennextjsFile, opennextjsDest)

    fs.copySync(envFile, envFileDest)
    fs.copySync(envDFile, envDFileDest)

    fs.copySync(cloudflareEnvDFile, cloudflareEnvDFileDest)
}
