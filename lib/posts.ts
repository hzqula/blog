import { client } from "./contentful";

export interface Post {
  id: string; // Contentful ID adalah string, bukan number
  title: string;
  excerpt: string;
  content: string;
  date: string;
  slug: string;
  readTime: string;
  category: string;
}

// Fungsi helper untuk memformat tanggal (opsional, sesuaikan format yang diinginkan)
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export async function getAllPosts(): Promise<Post[]> {
  const entries = await client.getEntries({
    content_type: "blogPost",
    order: ["-fields.date"],
  });

  return entries.items.map((item: any) => ({
    id: item.sys.id,
    title: item.fields.title,
    excerpt: item.fields.excerpt,
    content: item.fields.content,
    date: formatDate(item.fields.date),
    slug: item.fields.slug,
    readTime: item.fields.readTime,
    category: item.fields.category,
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const entries = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  });

  if (entries.items.length > 0) {
    const item: any = entries.items[0];
    return {
      id: item.sys.id,
      title: item.fields.title,
      excerpt: item.fields.excerpt,
      content: item.fields.content,
      date: formatDate(item.fields.date),
      slug: item.fields.slug,
      readTime: item.fields.readTime,
      category: item.fields.category,
    };
  }

  return undefined;
}
