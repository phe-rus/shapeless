import { type Dialect, type Orm } from "@/cli/index.js"
import { type InstallerMap, type Provider } from "@/installers/index.js"
import { getUserPkgManager } from "@/utils/get-user-pkg-manager.js"
import path from "path"
import { installBaseTemplate } from "./install-base-template.js"
import { installPackages } from "./install-packages.js"

interface ScaffoldProjectOptions {
  projectName: string
  orm: Orm
  dialect?: Dialect
  installers: InstallerMap
  databaseProvider: Provider
}

export const scaffoldProject = async ({
  databaseProvider,
  projectName,
  installers,
}: ScaffoldProjectOptions): Promise<string> => {
  const projectDir = path.resolve(process.cwd(), projectName)
  const pkgManager = getUserPkgManager()

  try {
    await installBaseTemplate({
      projectDir,
      pkgManager,
      noInstall: false,
      installers,
      projectName,
      databaseProvider,
    })

    installPackages({
      projectDir,
      pkgManager,
      noInstall: false,
      installers,
      projectName,
      databaseProvider,
    })

    return projectDir

  } catch (error) {
    throw new Error(`Failed to scaffold project: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
