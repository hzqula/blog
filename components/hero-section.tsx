import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Illustration */}
        <div className="flex justify-center md:justify-start order-1 md:order-none">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <Image src="/avatar-illustration.jpg" alt="Personal illustration" fill className="object-contain" />
          </div>
        </div>

        {/* Text content */}
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold leading-tight mb-6">
            Hello, I'm <span className="text-primary">Your Name</span>
          </h1>
          <p className="text-foreground/80 leading-relaxed mb-4 text-justify">
            Welcome to my personal space on the internet. I write about technology, design thinking, and occasionally
            share stories from my journey as a creative professional.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-8 text-justify">
            This blog is where I document my thoughts, experiments, and lessons learned along the way. Feel free to
            explore and connect with me.
          </p>
          <Button
            asChild
            variant="outline"
            className="group border-2 border-foreground hover:bg-foreground hover:text-background bg-transparent"
          >
            <Link href="/blog">
              Read My Blog
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
