import type { Metadata } from "next"
import { Providers } from "@resources/shared/providers"

import "@/app/globals.css"

export const metadata: Metadata = {
  title: "shapeless App",
  description: "Created using shapeless",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
