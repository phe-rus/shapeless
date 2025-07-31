import path from "path"
import * as p from "@clack/prompts"
import chalk from "chalk"
import fs from "fs-extra"
import ora from "ora"

import { PKG_ROOT } from "@/constants.js"
import { type InstallerOptions } from "@/installers/index.js"
import { logger } from "@/utils/logger.js"

const handleExistingDirectory = async (projectDir: string, projectName: string): Promise<void> => {
  if (!fs.existsSync(projectDir)) return

  const dirContents = fs.readdirSync(projectDir)

  if (dirContents.length === 0) {
    if (projectName !== ".") {
      logger.info(`${chalk.cyan.bold(projectName)} exists but is empty, continuing...`)
    }
    return
  }

  const overwriteChoice = await p.select({
    message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(
      projectName,
    )} already exists and isn't empty. How would you like to proceed?`,
    options: [
      { label: "Abort installation (recommended)", value: "abort" },
      { label: "Clear the directory and continue installation", value: "clear" },
      { label: "Continue installation and overwrite conflicting files", value: "overwrite" },
    ],
    initialValue: "abort",
  })

  if (p.isCancel(overwriteChoice) || overwriteChoice === "abort") {
    logger.error("Aborting installation...")
    process.exit(1)
  }

  const actionText = overwriteChoice === "clear"
    ? "clear the directory"
    : "overwrite conflicting files"

  const confirmAction = await p.confirm({
    message: `Are you sure you want to ${actionText}?`,
    initialValue: false,
  })

  if (p.isCancel(confirmAction) || !confirmAction) {
    logger.error("Aborting installation...")
    process.exit(1)
  }

  if (overwriteChoice === "clear") {
    logger.info(`Emptying ${chalk.cyan.bold(projectName)} and creating shapeless app...`)
    fs.emptyDirSync(projectDir)
  }
}

const copyTemplateFiles = (srcDir: string, baseAssetsDir: string, projectDir: string): void => {
  // Copy base template
  fs.copySync(srcDir, projectDir)

  // Replace package.json with the one from base-assets
  fs.removeSync(path.join(projectDir, "package.json"))
  const packageJsonPath = path.join(baseAssetsDir, "base-package.json")
  fs.copySync(packageJsonPath, path.join(projectDir, "package.json"))

  // Rename gitignore file
  fs.renameSync(
    path.join(projectDir, "_gitignore"),
    path.join(projectDir, ".gitignore"),
  )
}

export const installBaseTemplate = async ({
  projectName,
  projectDir,
  pkgManager,
  noInstall,
}: InstallerOptions): Promise<void> => {
  const srcDir = path.join(PKG_ROOT, "template/base")
  const baseAssetsDir = path.join(PKG_ROOT, "template/base-assets")

  if (!noInstall) {
    logger.info(`Using package manager: ${chalk.cyan.bold(pkgManager)}`)
  }

  const spinner = ora(`Scaffolding in: ${projectDir}...`).start()

  try {
    await handleExistingDirectory(projectDir, projectName)
    copyTemplateFiles(srcDir, baseAssetsDir, projectDir)

    const scaffoldedName = projectName === "." ? "App" : chalk.cyan.bold(projectName)
    spinner.succeed(`${scaffoldedName} ${chalk.green("scaffolded successfully!")}`)

  } catch (error) {
    spinner.fail("Failed to scaffold project")
    throw error
  }
}