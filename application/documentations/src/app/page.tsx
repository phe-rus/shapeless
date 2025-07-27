import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default async function Home() {
  return (
    <div className="flex flex-col gap-5 py-20">
      <div className="container">
        <div className="flex flex-col md:max-w-5xl">
          <h1
            className={cn(
              "inline-flex tracking-tight flex-col gap-1 transition text-center",
              "font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-none lg:text-[4rem]",
              "bg-gradient-to-r from-20% bg-clip-text",
            )}
          >
            <span className="font-black">shapeless</span>
          </h1>

          <p className="text-lg/7 md:text-xl/8 text-pretty sm:text-wrap sm:text-center text-center mb-8">
            The stack for building seriously fast, lightweight and{" "}
            <span className="inline sm:block">
              end-to-end typesafe Next.js apps.
            </span>
          </p>

          <div className="flex items-center justify-center">
            <Image
              alt="shapless logo"
              width={300}
              height={300}
              src={'/shapeless.png'}
            />
          </div>

          <div className="flex items-center justify-center">
            <Button size={'lg'} className="font-black">Learn more about shapeless</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
