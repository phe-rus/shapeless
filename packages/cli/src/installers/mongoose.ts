import fs from "fs-extra"
import path from "path"
import { type PackageJson } from "type-fest"

import { PKG_ROOT } from "@/constants.js"
import { type Installer } from "@/installers/index.js"
import { addPackageDependency } from "@/utils/add-package-dep.js"

export const mongooseInstaller: Installer = ({ projectDir, databaseProvider }) => {
    addPackageDependency({
        projectDir,
        dependencies: ["mongoose"],
        devDependencies: false,
    })

    addPackageDependency({
        projectDir,
        dependencies: ["@types/mongoose"],
        devDependencies: true,
    })

    const extrasDir = path.join(PKG_ROOT, "template/extras")

    // Copy mongoose-specific router
    const routerSrc = path.join(extrasDir, `resources/routers/post/with-mongoose.ts`)
    const routerDest = path.join(projectDir, `resources/routers/post-router.ts`)

    // Copy database connection file
    const dbConnectionSrc = path.join(extrasDir, `config/database/mongoose.ts`)
    const dbConnectionDest = path.join(projectDir, `lib/database.ts`)

    // Copy model files
    const modelSrc = path.join(extrasDir, `models/mongoose`)
    const modelDest = path.join(projectDir, `models`)

    // Add database scripts to package.json
    const packageJsonPath = path.join(projectDir, "package.json")
    const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson

    packageJsonContent.scripts = {
        ...packageJsonContent.scripts,
        "db:seed": "node scripts/seed.js",
    }

    if (databaseProvider === "mongodb-local") {
        packageJsonContent.scripts = {
            ...packageJsonContent.scripts,
            "db:start": "docker-compose up -d",
            "db:stop": "docker-compose down",
            "db:logs": "docker-compose logs -f mongodb",
        }
    }

    fs.copySync(routerSrc, routerDest)
    fs.copySync(dbConnectionSrc, dbConnectionDest)
    fs.copySync(modelSrc, modelDest)

    fs.writeJSONSync(packageJsonPath, packageJsonContent, {
        spaces: 2,
    })
}