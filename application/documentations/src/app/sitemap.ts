import { allManagements } from "content-collections"
import type { MetadataRoute } from "next"

const BASE_URL = "https://shapeless.pherus.orgjstack.app"

export default function sitemap(): MetadataRoute.Sitemap {
    const paths = allManagements.map((doc) => `${BASE_URL}/docs/${doc._meta.path}`)

    return [
        { url: "https://shapeless.pherus.org/", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
        ...paths.map((path) => ({
            url: path,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        })),
    ]
}