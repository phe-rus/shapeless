declare global {
    namespace NodeJS {
        interface ProcessEnv extends CloudflareEnv {
            GITHUB_TOKEN: string
        }
    }
}

export { }