import type { Metadata } from "next"
import { Providers } from "@resources/shared/providers"

import "@/app/globals.css"
import Header from "@/components/headers"
import { ThemeProvider } from "@/theme-provider"
import { unstable_cache } from "next/cache"

export const revalidate = 3600

export interface GitHubResponse {
  stargazers_count: number
}

export const metadata: Metadata = {
  title: "shapeless documentations",
  description: "Created using shapeless",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const getGitHubStars = unstable_cache(
  async () => {
    if (process.env.NODE_ENV === "development") return "500"
    const response = await fetch(
      "https://api.github.com/repos/phe-rus/shapeless",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: {
          tags: ["github-stars"],
          revalidate: 60,
        },
      },
    )
    const data = (await response.json()) as GitHubResponse
    return data.stargazers_count
  },
  ["github-stars"],
  {
    revalidate: 60,
    tags: ["github-stars"],
  },
)


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const stars = await getGitHubStars()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <Providers>
            <div className="relative flex flex-col w-full min-h-screen">
              <Header count={stars} />
              <div className="flex-1">{children}</div>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
