import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { posts } from "@/lib/posts"

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Articles</h1>
            <p className="text-muted-foreground mb-12">
              Thoughts, tutorials, and insights on technology, design, and life.
            </p>

            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{post.date}</span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        Read article <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
