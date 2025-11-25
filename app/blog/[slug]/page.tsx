import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPostBySlug, posts } from "@/lib/posts"

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-6 py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to blog
            </Link>

            {/* Post header */}
            <header className="mb-10 pb-8 border-b-2 border-foreground">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">{post.category}</span>
              <h1 className="text-3xl md:text-4xl font-serif font-semibold leading-tight mt-3 mb-4 text-balance">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </header>

            {/* Post content */}
            <div className="prose prose-neutral max-w-none">
              {post.content.split("\n").map((paragraph, index) => {
                const trimmed = paragraph.trim()
                if (!trimmed) return null

                if (trimmed.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-xl font-serif font-semibold mt-10 mb-4 text-foreground">
                      {trimmed.replace("## ", "")}
                    </h2>
                  )
                }

                if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                  return (
                    <p key={index} className="font-semibold mb-2 text-foreground">
                      {trimmed.replace(/\*\*/g, "")}
                    </p>
                  )
                }

                if (trimmed.startsWith("**")) {
                  const parts = trimmed.split("**")
                  return (
                    <p key={index} className="text-foreground/85 leading-relaxed mb-4 text-justify">
                      {parts.map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="text-foreground">
                            {part}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                    </p>
                  )
                }

                if (trimmed.match(/^\d\./)) {
                  return (
                    <p key={index} className="text-foreground/85 leading-relaxed mb-2 pl-4">
                      {trimmed}
                    </p>
                  )
                }

                if (trimmed.startsWith("- ")) {
                  return (
                    <p key={index} className="text-foreground/85 leading-relaxed mb-2 pl-4">
                      • {trimmed.replace("- ", "")}
                    </p>
                  )
                }

                return (
                  <p key={index} className="text-foreground/85 leading-relaxed mb-4 text-justify">
                    {trimmed}
                  </p>
                )
              })}
            </div>

            {/* Post footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm italic">
                Thank you for reading. If you enjoyed this article, feel free to share it.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
