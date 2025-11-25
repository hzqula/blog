import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-12">About Me</h1>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
                  <img src="/professional-portrait-illustration-warm-tones.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-1 space-y-5">
                <p className="text-lg leading-relaxed">
                  Hi there! I'm a <span className="text-primary font-medium">writer and developer</span> passionate
                  about sharing knowledge and building things for the web.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This blog is my personal corner of the internet where I document my journey, share tutorials, and
                  write about topics that interest me — from technology and design to productivity and life lessons.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When I'm not coding or writing, you'll find me exploring new tools, reading books, or enjoying a quiet
                  moment with a cup of coffee.
                </p>

                <div className="pt-4">
                  <Button asChild variant="outline">
                    <Link href="mailto:hello@example.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Get in touch
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-border">
              <h2 className="text-xl font-serif font-semibold mb-6">What I Write About</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Web Development", "Design", "Productivity", "Tech Reviews", "Tutorials", "Life Lessons"].map(
                  (topic) => (
                    <div key={topic} className="bg-secondary/50 rounded-lg px-4 py-3 text-sm font-medium text-center">
                      {topic}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
