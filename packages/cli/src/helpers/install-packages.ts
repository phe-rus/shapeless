import chalk from "chalk"
import ora from "ora"

import { type InstallerOptions } from "@/installers/index.js"
import { logger } from "@/utils/logger.js"

const installPackageGroup = (
  groupName: string,
  packages: Record<string, { inUse: boolean; installer: (opts: InstallerOptions) => void }>,
  options: InstallerOptions
): void => {
  for (const [name, pkgOpts] of Object.entries(packages)) {
    if (!pkgOpts.inUse) continue

    const spinner = ora(`Setting up ${groupName}: ${name}...`).start()

    try {
      pkgOpts.installer(options)
      spinner.succeed(chalk.green(`Successfully configured ${groupName}: ${chalk.bold(name)}`))
    } catch (error) {
      spinner.fail(`Failed to configure ${groupName}: ${name}`)
      throw error
    }
  }
}

export const installPackages = (options: InstallerOptions): void => {
  const { installers } = options

  logger.info("Adding boilerplate...")

  try {
    installPackageGroup("ORM", installers.orm, options)
    installPackageGroup("provider", installers.provider, options)
    logger.success("Boilerplate setup completed!")

  } catch (error) {
    logger.error("Failed to install packages")
    throw error
  }
}
