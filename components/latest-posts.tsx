import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { posts } from "@/lib/posts"

export function LatestPosts() {
  return (
    <section className="container mx-auto px-6 py-16 border-t-2 border-foreground">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-semibold">Recent Writings</h2>
        <Link
          href="/blog"
          className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
        >
          All posts <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {posts.slice(0, 4).map((post) => (
          <article key={post.id} className="py-6 group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">{post.category}</span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-medium group-hover:text-primary transition-colors">{post.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground md:text-right">{post.date}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
