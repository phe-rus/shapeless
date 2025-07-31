import { getUserPkgManager, type PackageManager } from "@/utils/get-user-pkg-manager.js"
import { logger } from "@/utils/logger.js"
import chalk from "chalk"
import { execa, type Options } from "execa"
import ora, { type Ora } from "ora"

interface ExecWithSpinnerOptions {
  args?: string[]
  stdout?: Options["stdout"]
  onDataHandle?: (spinner: Ora) => (data: Buffer) => void
}

const execWithSpinner = async (
  projectDir: string,
  pkgManager: PackageManager,
  options: ExecWithSpinnerOptions = {}
): Promise<Ora> => {
  const { onDataHandle, args = ["install"], stdout = "pipe" } = options

  const spinner = ora(`Running ${pkgManager} install...`).start()

  try {
    const subprocess = execa(pkgManager, args, { cwd: projectDir, stdout })

    if (onDataHandle && subprocess.stdout) {
      subprocess.stdout.on("data", onDataHandle(spinner))
    }

    await subprocess
    return spinner

  } catch (error) {
    spinner.fail(`Failed to run ${pkgManager} install`)
    throw error
  }
}

const getInstallStrategy = (pkgManager: PackageManager) => {
  const strategies = {
    npm: async (projectDir: string) => {
      await execa(pkgManager, ["install"], {
        cwd: projectDir,
        stderr: "inherit",
      })
      return null
    },

    pnpm: (projectDir: string) => execWithSpinner(projectDir, pkgManager, {
      onDataHandle: (spinner) => (data) => {
        const text = data.toString()
        if (text.includes("Progress")) {
          spinner.text = text.includes("|") ? (text.split(" | ")[1] ?? "") : text
        }
      },
    }),

    yarn: (projectDir: string) => execWithSpinner(projectDir, pkgManager, {
      onDataHandle: (spinner) => (data) => {
        spinner.text = data.toString()
      },
    }),

    bun: (projectDir: string) => execWithSpinner(projectDir, pkgManager, {
      stdout: "ignore"
    }),
  }

  return strategies[pkgManager]
}

export const installDependencies = async ({ projectDir }: { projectDir: string }): Promise<void> => {
  logger.info("Installing dependencies...")

  const pkgManager = getUserPkgManager()
  const installStrategy = getInstallStrategy(pkgManager)

  try {
    const spinner = await installStrategy(projectDir)
      ; (spinner ?? ora()).succeed(chalk.green("Successfully installed dependencies!"))

  } catch (error) {
    logger.error("Failed to install dependencies")
    throw error
  }
}