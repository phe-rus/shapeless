import * as p from "@clack/prompts"
import color from "picocolors"
import chalk from "chalk"
import { getUserPkgManager } from "@/utils/get-user-pkg-manager.js"

export interface CliResults {
  projectName: string
  orm: "none" | "drizzle"
  dialect?: "postgres" | "sqlite"
  provider?: "neon" | "postgres" | "d1-http" | "vercel-postgres" | "planetscale"
  noInstall: boolean
}

export type Dialect = CliResults["dialect"]
export type Orm = CliResults["orm"]

interface CliArgs {
  projectName?: string
  noInstall: boolean
}

const parseCliArgs = (): CliArgs => {
  const args = process.argv.slice(2)
  const projectName = args.find(arg => !arg.startsWith("--"))
  const noInstall = args.includes("--noInstall")

  return { projectName, noInstall }
}

const validateProjectName = (value: string): string | undefined => {
  if (!value) return "Please enter a project name"
  if (value.length > 50) return "Project name must be less than 50 characters"
  if (!/^[a-zA-Z0-9-_]+$/.test(value)) return "Project name can only contain letters, numbers, hyphens, and underscores"
  return undefined
}

const promptProjectName = async (cliProvidedName?: string): Promise<string> => {
  if (cliProvidedName) return cliProvidedName

  const projectName = await p.text({
    message: "What will your project be called?",
    placeholder: "my-shapeless-app",
    validate: validateProjectName,
  })

  if (p.isCancel(projectName)) {
    p.outro("Setup cancelled.")
    process.exit(0)
  }

  return projectName
}

const promptOrm = async (): Promise<Orm> => {
  const orm = await p.select<Orm>({
    message: "Which database ORM would you like to use?",
    options: [
      { value: "none", label: "None" },
      { value: "drizzle", label: "Drizzle ORM" },
    ],
  })

  if (p.isCancel(orm)) {
    p.outro("Setup cancelled.")
    process.exit(0)
  }

  return orm
}

const promptDialect = async (): Promise<Dialect> => {
  const dialect = await p.select({
    message: "Which dialect would you like to use?",
    options: [
      { value: "postgres", label: "PostgreSQL" },
      { value: "sqlite", label: "SQLite" }
    ]
  })

  if (p.isCancel(dialect)) {
    p.outro("Setup cancelled.")
    process.exit(0)
  }

  return dialect as Dialect
}

const promptProvider = async (dialect: Dialect): Promise<CliResults["provider"]> => {
  const isPostgres = dialect === "postgres"

  const options = isPostgres
    ? [
      { value: "postgres", label: "PostgreSQL" },
      { value: "neon", label: "Neon" },
      { value: "vercel-postgres", label: "Vercel Postgres" }
    ]
    : [
      { value: "d1-http", label: "D1 HTTP" }
    ]

  const provider = await p.select({
    message: `Which ${dialect} provider would you like to use?`,
    options,
  })

  if (p.isCancel(provider)) {
    p.outro("Setup cancelled.")
    process.exit(0)
  }

  return provider as CliResults["provider"]
}

const promptInstallDependencies = async (noInstallFlag: boolean): Promise<boolean> => {
  if (noInstallFlag) return true

  const pkgManager = getUserPkgManager()
  const installCommand = pkgManager === "yarn" ? "yarn" : `${pkgManager} install`

  const shouldSkipInstall = await p.select({
    message: `Should we run '${installCommand}' for you?`,
    options: [
      { value: false, label: "Yes" },
      { value: true, label: "No" },
    ],
  })

  if (p.isCancel(shouldSkipInstall)) {
    p.outro("Setup cancelled.")
    process.exit(0)
  }

  return shouldSkipInstall
}

const displayNextSteps = (results: CliResults): void => {
  console.log('\n' + chalk.green('✓ Shapeless project successfully created!'))

  p.log.step(chalk.bgGreen(chalk.black(' Next Steps ')))
  p.log.message(`${chalk.cyan('cd')} ${results.projectName}`)

  if (results.orm !== "none") {
    p.log.message(`${chalk.gray('ORM:')} ${results.orm}`)
    if (results.dialect) {
      p.log.message(`${chalk.gray('Dialect:')} ${results.dialect}`)
    }
    if (results.provider) {
      p.log.message(`${chalk.gray('Provider:')} ${results.provider}`)
    }
  }

  if (results.noInstall) {
    const pkgManager = getUserPkgManager()
    const installCommand = pkgManager === "yarn" ? "yarn" : `${pkgManager} install`
    p.log.message(`Run ${chalk.cyan(installCommand)} to install dependencies`)
  }
}

export async function runCli(): Promise<CliResults> {
  const { projectName: cliProvidedName, noInstall: noInstallFlag } = parseCliArgs()

  p.intro(color.bgCyan(chalk.black(" SHAPELESS CLI ")))
  p.note("Welcome to Shapeless. Let's create a project!")

  try {
    const projectName = await promptProjectName(cliProvidedName)
    const orm = await promptOrm()

    let dialect: Dialect | undefined
    let provider: CliResults["provider"] | undefined

    if (orm === "drizzle") {
      dialect = await promptDialect()
      provider = await promptProvider(dialect)
    }

    const noInstall = await promptInstallDependencies(noInstallFlag)

    const results: CliResults = {
      projectName,
      orm,
      dialect,
      provider,
      noInstall,
    }

    displayNextSteps(results)
    return results

  } catch (error) {
    p.outro(chalk.red("An error occurred during setup"))
    throw error
  }
}