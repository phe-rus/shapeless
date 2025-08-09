import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShinyButton } from "../ui/shiny-button";
import { Icons } from "../icons";
import { Star } from "lucide-react";
import { MobileNavigation } from "../mobile-nav";

type props = {
    count: string | number
}

export default function Header({ count }: props) {
    return (
        <header className={cn('fixed top-5 w-full z-55 flex items-center justify-center mx-0')}>
            <div className="container flex items-center justify-center">
                <section className={cn(
                    'relative flex items-center justify-between shadow-2xl',
                    'backdrop-blur-3xl rounded-2xl w-full md:max-w-5xl bg-muted px-3 md:px-5 py-3'
                )}>

                    <div className="flex items-center z-1">
                        <Link href={'/'} className="text-lg md:text-2xl font-black">Shapeless</Link>
                    </div>

                    <nav className="flex items-center gap-3 text-primary dark:text-secondary-foreground">
                        <Link href={'/docs'} className={cn("hover:underline decoration-wavy cursor-pointer")}>Docs</Link>
                        <Link aria-disabled href={'#'} className={cn("hover:underline decoration-wavy cursor-pointer text-secondary-foreground/55")}>Templates</Link>
                        <MobileNavigation />
                        <ShinyButton
                            className="group hidden md:flex text-sm text-muted-light"
                            href="https://github.com/phe-rus/shapeless"
                        >
                            <Icons.github className="size-4 shrink-0" />
                            Star <span className="hidden md:flex">on GitHub</span>
                            <Star className="size-4 shrink-0 fill-gray-500 group-hover:fill-brand-500 transition-colors stroke-transparent" />
                            {count.toLocaleString()}
                        </ShinyButton>
                    </nav>
                </section>
            </div>
        </header>
    )
}