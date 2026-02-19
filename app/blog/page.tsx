import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts, getAllCategories } from "@/lib/posts";

export default async function BlogPage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
              Hasil Nulis
            </h1>
            <p className="text-muted-foreground mb-8">
              Sedikit tips ketika sedang membaca tulisan-tulisan di bawah ini.
              Jika sudah nggak sanggup, silakan melambai ke kamera.
            </p>

            {/* Filter Kategori */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog/${cat.slug}`}
                    className="inline-block text-xs font-medium text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  {/* Label kategori - link terpisah */}
                  <div className="flex items-center gap-3 mb-3">
                    <Link
                      href={`/blog/${post.category.slug}`}
                      className="inline-block text-xs font-medium text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded transition-colors"
                    >
                      {post.category.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Konten post - link terpisah agar tidak nested */}
                  <Link
                    href={`/blog/${post.category.slug}/${post.slug}`}
                    className="block"
                  >
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{post.date}</span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        Sini Baca <ArrowUpRight className="h-4 w-4" />
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
  );
}
