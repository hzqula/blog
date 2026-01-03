import { client } from "./contentful";
import { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: Document;
  date: string;
  slug: string;
  readTime: string;
  category: string;
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  userImage: string;
  date: string;
}

// Helper format tanggal
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", { timeZone: "UTC" });
};

// Helper kalkulasi Read Time
const calculateReadTime = (document: Document): string => {
  const text = documentToPlainTextString(document);
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} menit baca`;
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
    readTime: calculateReadTime(item.fields.content),
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
      readTime: calculateReadTime(item.fields.content),
      category: item.fields.category,
    };
  }

  return undefined;
}

export async function getComments(slug: string): Promise<Comment[]> {
  const entries = await client.getEntries({
    content_type: "comment",
    "fields.postSlug": slug,
    order: ["-fields.date"],
  });

  return entries.items.map((item: any) => ({
    id: item.sys.id,
    name: item.fields.name,
    email: item.fields.email,
    message: item.fields.message,
    userImage: item.fields.userImage,
    date: formatDate(item.fields.date),
  }));
}
