import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/api",
        },
        sitemap: "https://shapeless.pherus.org/sitemap.xml",
    }
}