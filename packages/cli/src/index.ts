// #!/usr/bin/env node

import fs from "fs-extra"
import path from "path"

import { runCli } from "./cli/index.js"
import { scaffoldProject } from "./helpers/scaffold-project.js"
import { buildInstallerMap } from "./installers/index.js"
import { logger } from "./utils/logger.js"
import { installDependencies } from "./helpers/install-deps.js"

const updateProjectConfig = (projectDir: string, projectName: string, provider?: string): void => {
  // Update package.json
  const packageJsonPath = path.join(projectDir, "package.json")
  const pkgJson = fs.readJSONSync(packageJsonPath)
  pkgJson.name = projectName
  fs.writeJSONSync(packageJsonPath, pkgJson, { spaces: 2 })

  // Update wrangler.jsonc for D1 provider
  if (provider === "d1-http") {
    const wranglerJsonPath = path.join(projectDir, "wrangler.jsonc")
    if (fs.existsSync(wranglerJsonPath)) {
      const wranglerJson = fs.readJSONSync(wranglerJsonPath)
      wranglerJson.name = projectName
      fs.writeJSONSync(wranglerJsonPath, wranglerJson, { spaces: 2 })
    }
  }
}

const main = async (): Promise<void> => {
  try {
    const results = await runCli()
    const { projectName, orm, dialect, provider, noInstall } = results

    const installers = buildInstallerMap(orm, provider)

    const projectDir = await scaffoldProject({
      orm,
      dialect,
      databaseProvider: provider ?? "neon",
      installers,
      projectName,
    })

    updateProjectConfig(projectDir, projectName, provider)

    if (!noInstall) {
      await installDependencies({ projectDir })
    }

    logger.success(`Project ${projectName} created successfully!`)
    process.exit(0)

  } catch (error) {
    logger.error("Aborting installation...")

    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`)
      if (process.env.DEBUG) {
        logger.error(error.stack)
      }
    } else {
      logger.error("An unknown error occurred. Please open an issue on GitHub with the details below:")
      console.error(error)
    }

    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error.message)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason)
  process.exit(1)
})

main()