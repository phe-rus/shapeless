import fs from "fs-extra"
import path from "path"

import { PKG_ROOT } from "@/constants.js"
import { type Installer } from "@/installers/index.js"

export const mongodbLocalInstaller: Installer = ({ projectDir, projectName }) => {
    const extrasDir = path.join(PKG_ROOT, "template/extras")

    // Copy Docker Compose configuration
    const dockerComposeSrc = path.join(extrasDir, `config/docker-compose-mongodb.yml`)
    const dockerComposeDest = path.join(projectDir, `docker-compose.yml`)

    // Copy environment configuration
    const envSrc = path.join(extrasDir, `config/_env-mongodb-local`)
    const envDest = path.join(projectDir, `.env`)

    // Copy database initialization scripts
    const initScriptSrc = path.join(extrasDir, `scripts/mongodb-init`)
    const initScriptDest = path.join(projectDir, `scripts`)

    fs.copySync(dockerComposeSrc, dockerComposeDest)
    fs.copySync(envSrc, envDest)
    fs.copySync(initScriptSrc, initScriptDest)

    // Create .env.example
    const envExampleDest = path.join(projectDir, `.env.example`)
    let envContent = fs.readFileSync(envDest, "utf-8")

    // Replace sensitive values in .env.example
    envContent = envContent.replace(/mongodb:\/\/.*/, "mongodb://username:password@localhost:27017/your_database_name")
    fs.writeFileSync(envExampleDest, envContent)
}