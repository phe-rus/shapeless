import fs from "fs-extra"
import path from "path"

import { Installer } from "./index.js"
import { PKG_ROOT } from "@/constants.js"

export const noOrmInstaller: Installer = ({ projectDir }) => {
  const extrasDir = path.join(PKG_ROOT, "template/extras")

  const routerSrc = path.join(extrasDir, `resources/routers/post/base.ts`)
  const routerDest = path.join(projectDir, `resources/routers/post-router.ts`)

  const jstackSrc = path.join(extrasDir, "resources/shapeless", `base.ts`)
  const jstackDest = path.join(projectDir, "resources/shapeless.ts")

  fs.ensureDirSync(path.dirname(routerDest))
  fs.ensureDirSync(path.dirname(jstackDest))

  fs.copySync(routerSrc, routerDest)
  fs.copySync(jstackSrc, jstackDest)
}
