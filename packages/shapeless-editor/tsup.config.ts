import { defineConfig } from "tsup"

export default defineConfig([
    {
        entry: ["src/index.ts"],
        outDir: "dist/server",
        format: ["esm", "cjs"],
        dts: true,
        clean: false,
        minify: false,
        //external: ["zod"],
    }
])
