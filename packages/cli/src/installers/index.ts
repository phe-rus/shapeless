import { PackageManager } from "@/utils/get-user-pkg-manager.js"
import { drizzleInstaller } from "./drizzle.js"
import { neonInstaller } from "./neon.js"
import { d1Installer } from "./d1-http.js"
import { noOrmInstaller } from "./no-orm.js"
import { postgresInstaller } from "./postgres.js"
import { vercelPostgresInstaller } from "./vercel-postgres.js"
import { planetscaleInstaller } from "./planetscale.js"

// Turning this into a const allows the list to be iterated over for programmatically creating prompt options
// Should increase extensibility in the future
export const orms = ["none", "drizzle"] as const
export type Orm = (typeof orms)[number]

export const dialects = ["postgres", "sqlite"] as const
export type Dialect = (typeof dialects)[number]

export const providers = ["postgres", "neon", "d1-http", "vercel-postgres", "planetscale"] as const
export type Provider = (typeof providers)[number]

export type InstallerMap = {
  orm: {
    [key in Orm]: {
      inUse: boolean
      installer: Installer
    }
  }
  provider: {
    [key in Provider]: {
      inUse: boolean
      installer: Installer
    }
  }
}

export interface InstallerOptions {
  projectDir: string
  pkgManager: PackageManager
  noInstall: boolean
  installers: InstallerMap
  appRouter?: boolean
  projectName: string
  databaseProvider: Provider
}

export type Installer = (opts: InstallerOptions) => void

export const buildInstallerMap = (
  selectedOrm: Orm = "none",
  selectedProvider?: Provider
): InstallerMap => ({
  orm: {
    none: {
      inUse: selectedOrm === "none",
      installer: noOrmInstaller,
    },
    drizzle: {
      inUse: selectedOrm === "drizzle",
      installer: drizzleInstaller,
    },
  },
  provider: {
    postgres: {
      inUse: selectedProvider === "postgres",
      installer: postgresInstaller,
    },
    neon: {
      inUse: selectedProvider === "neon",
      installer: neonInstaller,
    },
    "d1-http": {
      inUse: selectedProvider === "d1-http",
      installer: d1Installer
    },
    "vercel-postgres": {
      inUse: selectedProvider === "vercel-postgres",
      installer: vercelPostgresInstaller,
    },
    planetscale: {
      inUse: selectedProvider === "planetscale",
      installer: planetscaleInstaller
    }
  },
})
