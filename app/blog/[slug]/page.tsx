import Link from "next/link";
import Image from "next/image"; // Import Image
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getPostBySlug, getAllPosts, getComments } from "@/lib/posts";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import Comments from "@/components/comments";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Tulisan Nggak Ditemuin",
    };
  }

  // Cari URL gambar utama jika ada (dari konten Rich Text)
  let ogImage = "/placeholder-logo.png"; // Gambar default
  // Logika sederhana untuk mencari gambar pertama di konten (opsional tapi bagus)
  const imageNode = post.content.content.find(
    (node: any) => node.nodeType === "embedded-asset-block"
  );
  if (imageNode) {
    ogImage = `https:${imageNode.data.target.fields.file.url}`;
  }

  return {
    title: `${post.title} — Muhammad Faruq`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://muhammadfaruq.vercel.app/blog/${post.slug}`,
      siteName: "Muhammad Faruq",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: "id_ID",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

// Konfigurasi styling untuk Rich Text
const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="text-foreground/85 leading-relaxed mb-4 text-justify">
        {children}
      </p>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-xl font-serif font-semibold mt-10 mb-4 text-foreground">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="text-lg font-serif font-semibold mt-8 mb-3 text-foreground">
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc pl-5 mb-4 text-foreground/85 space-y-2">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal pl-5 mb-4 text-foreground/85 space-y-2">
        {children}
      </ol>
    ),
    [BLOCKS.QUOTE]: (node: any, children: any) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { title, file } = node.data.target.fields;

      if (!file.contentType.includes("image")) {
        return null;
      }

      return (
        <div className="my-8 relative w-full h-auto rounded-lg overflow-hidden border border-border">
          <Image
            src={`https:${file.url}`}
            alt={title || "Blog Image"}
            width={file.details.image.width}
            height={file.details.image.height}
            loading="eager"
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          />
        </div>
      );
    },
  },
  renderMark: {
    [MARKS.BOLD]: (text: any) => (
      <strong className="font-semibold text-foreground">{text}</strong>
    ),
    [MARKS.CODE]: (text: any) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
        {text}
      </code>
    ),
  },
};

export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const comments = await getComments(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-6 py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Tulisan
            </Link>

            <header className="mb-10 pb-8 border-b-2 border-foreground">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {post.category}
              </span>
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

            <div className="prose prose-neutral max-w-none">
              {documentToReactComponents(post.content, renderOptions)}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm italic">
                Semoga ketemu di tulisan lainnya. Semoga:)
              </p>
              <Comments postSlug={post.slug} initialComments={comments} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
