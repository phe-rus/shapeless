"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { DocNavigation } from "./doc-navigation"
import { Icons } from "./icons"
import Link from "next/link"
import { Button } from "./ui/button"
import { useState } from "react"

export function MobileNavigation() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet
            open={open}
            onOpenChange={setOpen}
        >
            <SheetTrigger asChild>
                <Button size={'icon'} className="flex items-center gap-1.5 text-muted-light lg:hidden">
                    <Menu className="size-4" />
                    <span className="sr-only">Menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-4/5 z-56 max-w-sm bg-zinc-900 border-none">
                <SheetHeader>
                    <SheetTitle className="">
                        <Link href="/" aria-label="Home" className="flex gap-3 py-1.5 items-center">
                            <Icons.logo className="size-7" />
                            <div className="flex items-center gap-1.5">
                                <p className="text-muted-light font-semibold tracking-tight">JStack</p>
                                <p className="text-muted-dark">docs</p>
                            </div>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-screen overflow-auto">
                    <DocNavigation className="flex-1 px-2 pb-20 h-screen" onLinkClick={() => setOpen(!open)} />
                </div>
            </SheetContent>
        </Sheet>
    )
}