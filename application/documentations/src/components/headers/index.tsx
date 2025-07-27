import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Header() {
    return (
        <header className={cn('sticky top-5 z-55 flex items-center justify-center mx-0')}>
            <div className="container flex items-center justify-center">
                <section className={cn(
                    'relative flex items-center justify-between shadow-2xl',
                    'backdrop-blur-3xl rounded-2xl w-full md:max-w-5xl bg-muted px-3 md:px-5 py-3'
                )}>

                    <div className="flex items-center z-1">
                        <Link href={'/'} className="text-2xl font-black">Shapeless</Link>
                    </div>

                    <nav className="flex items-center gap-3 text-primary dark:text-secondary-foreground">
                        <Link href={'/documentations'} className={cn("hover:underline decoration-wavy cursor-pointer")}>Documentations</Link>
                        <Link href={'/templates'} className={cn("hover:underline decoration-wavy cursor-pointer text-secondary-foreground/55")}>Templates</Link>
                        <Link href={'/examples'} className={cn("hover:underline decoration-wavy cursor-pointer text-secondary-foreground/55")}>Examples</Link>
                    </nav>
                </section>
            </div>
        </header>
    )
}