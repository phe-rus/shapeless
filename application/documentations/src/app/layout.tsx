import type { Metadata } from "next"
import { Providers } from "@resources/shared/providers"

import "@/app/globals.css"
import Header from "@/components/headers"
import { ThemeProvider } from "@/theme-provider"

export const metadata: Metadata = {
  title: "shapeless documentations",
  description: "Created using shapeless",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
              <Header />
              <div className="flex-1">{children}</div>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
