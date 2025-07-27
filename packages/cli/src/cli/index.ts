import * as p from "@clack/prompts"
import color from "picocolors"
import { getUserPkgManager } from "@/utils/get-user-pkg-manager.js"
import chalk from "chalk"
import { info } from "console"

export interface CliResults {
  projectName: string
  orm: "none" | "drizzle" | undefined
  dialect?: "postgres" | 'sqlite' | undefined
  provider?: "neon" | "postgres" | 'd1-http' | "vercel-postgres" | "planetscale" | undefined
  noInstall?: boolean
}

export type Dialect = CliResults["dialect"]
export type Orm = CliResults["orm"]

export async function runCli(): Promise<CliResults | undefined> {
  //console.clear()

  // Parse command line arguments manually
  const args = process.argv.slice(2)
  const cliProvidedName = args[0]?.startsWith("--") ? undefined : args[0]
  const noInstallFlag = args.includes("--noInstall")

  p.intro(color.bgCyan(chalk.black(" SHAPELESS CLI ")))
  p.note("Welcome to Shapeless. Let's create a project!")

  const projectName =
    cliProvidedName ||
    (await p.text({
      message: "What will your project be called ?",
      placeholder: "my-shapeless-app",
      validate: (value) => {
        if (!value) return "Please enter a project name"
        if (value.length > 50) return "Project name must be less than 50 characters"
        return
      },
    }))

  if (p.isCancel(projectName)) {
    p.outro("Setup cancelled.")
    return undefined
  }

  const orm = await p.select<"none" | "drizzle">({
    message: "Which database ORM would you like to use?",
    options: [
      { value: "none", label: "None" },
      { value: "drizzle", label: "Drizzle ORM" },
    ],
  })

  if (p.isCancel(orm)) {
    p.outro("Setup cancelled.")
    return undefined
  }

  let dialect = undefined
  let provider = undefined
  if (orm === "drizzle") {
    dialect = await p.select({
      message: "Which dialect would you like to use",
      options: [
        { value: "postgres", label: "Postgres" },
        { value: "sqlite", label: "Sqlite" }
      ]
    })

    if (p.isCancel(dialect)) {
      p.outro("Setup cancelled.")
      return undefined
    }

    if (dialect === "sqlite") {
      provider = await p.select({
        message: "Which Sqlite provider would you like to use?",
        options: [
          { value: "d1-http", label: 'D1 Http' }
        ],
      })
    } else {
      provider = await p.select({
        message: "Which Postgres provider would you like to use?",
        options: [
          { value: "postgres", label: "PostgreSQL" },
          { value: "neon", label: "Neon" },
          { value: "vercel-postgres", label: "Vercel Postgres" }
        ],
      })
    }

    if (p.isCancel(provider)) {
      p.outro("Setup cancelled.")
      return undefined
    }
  }

  let noInstall = noInstallFlag
  if (!noInstall) {
    const pkgManager = getUserPkgManager()
    const shouldInstall = await p.select({
      message: `Should we run '${pkgManager}${pkgManager === "yarn" ? "" : " install"}' for you?`,
      options: [
        { value: false, label: "Yes" },
        { value: true, label: "No" },
      ],
    })

    if (p.isCancel(shouldInstall)) {
      p.outro("Setup cancelled.")
      return undefined
    }

    noInstall = shouldInstall
  }

  info('Shapeless project successfully created!')
  p.log.step(chalk.bgGreen(chalk.black(' Next Steps ')))
  p.log.message(chalk.bgGreen(`cd ${chalk.black(projectName)}`))
  p.log.message(chalk.bgGreen(`Dialet ${chalk.gray(orm)}`))
  p.log.message(chalk.bgGreen(`Dialect ${chalk.gray(dialect)}`))
  p.log.message(chalk.bgGreen(`Provider ${chalk.gray(provider)}`))
  return {
    projectName: projectName as string,
    orm,
    dialect,
    provider,
    noInstall,
  }
}
