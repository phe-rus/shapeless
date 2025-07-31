import fs from "fs-extra"
import path from "path"

import { PKG_ROOT } from "@/constants.js"
import { type Installer } from "@/installers/index.js"

export const mongodbAtlasInstaller: Installer = ({ projectDir }) => {
    const extrasDir = path.join(PKG_ROOT, "template/extras")

    // Copy environment configuration for Atlas
    const envSrc = path.join(extrasDir, `config/_env-mongodb-atlas`)
    const envDest = path.join(projectDir, `.env`)

    // Copy Atlas-specific configuration
    const configSrc = path.join(extrasDir, `config/mongodb-atlas.ts`)
    const configDest = path.join(projectDir, `lib/mongodb-atlas.ts`)

    fs.copySync(envSrc, envDest)
    fs.copySync(configSrc, configDest)

    // Create .env.example with placeholder values
    const envExampleDest = path.join(projectDir, `.env.example`)
    let envContent = fs.readFileSync(envDest, "utf-8")

    // Replace sensitive values in .env.example
    envContent = envContent
        .replace(/MONGODB_URI=.*/, "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/")
        .replace(/MONGODB_DATABASE_NAME=.*/, "MONGODB_DATABASE_NAME=your_database_name")

    fs.writeFileSync(envExampleDest, envContent)
}