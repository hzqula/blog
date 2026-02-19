import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import {
  getPostsByCategory,
  getCategoryBySlug,
  getAllCategories,
} from "@/lib/posts";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "Kategori Tidak Ditemukan" };
  }

  return {
    title: `${category.name} — Muhammad Faruq`,
    description:
      category.description || `Tulisan dengan label ${category.name}`,
  };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export const revalidate = 0;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(categorySlug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Semua Tulisan
            </Link>

            {/* Header Kategori */}
            <div className="mb-12 pb-8 border-b-2 border-foreground">
              <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded mb-3">
                Kategori
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {category.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                {posts.length} tulisan
              </p>
            </div>

            {/* List Post */}
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <Link
                      href={`/blog/${categorySlug}/${post.slug}`}
                      className="block"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-muted-foreground">
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1 text-primary font-medium">
                          Sini Baca <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))
              ) : (
                <p className="text-center text-muted-foreground italic py-12">
                  Belum ada tulisan di kategori ini.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
