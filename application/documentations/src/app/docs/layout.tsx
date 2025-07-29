import { DocNavigation } from "@/components/doc-navigation"
import { cn, constructMetadata } from "@/lib/utils"
import { TableOfContents } from "lucide-react"

export const revalidate = 3600
export const metadata = constructMetadata({
    title: "Shapeless Docs – Full-Stack Next.js & TypeScript Toolkit",
})

export default async function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {

    return (
        <div className={cn('w-full flex items-center justify-center mx-0')}>
            <div className="container flex items-center justify-center">
                <div className="flex flex-col md:max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6">
                        <aside className="hidden lg:block col-span-1 md:col-span-3">
                            <nav className="sticky top-0 h-screen pt-20">
                                <DocNavigation className="h-full overflow-y-auto py-16 pr-4
                scrollbar-thin scrollbar-thumb-zinc-700 no-scrollbar scrollbar-track-transparent hover:scrollbar-thumb-zinc-600" />
                            </nav>
                        </aside>

                        {/* Main content */}
                        <main className="col-span-1 md:col-span-7 bg-dark-gray/10 border-x border-dark-gray">
                            <div className="w-full px-5 pt-32">
                                {children}
                            </div>
                        </main>

                        {/* Right TOC */}
                        <aside className="col-span-1 md:col-span-2 hidden xl:block">
                            <div className="sticky top-24 pt-10">
                                <TableOfContents className="z-55" />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}