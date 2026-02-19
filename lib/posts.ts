import { client } from "./contentful";
import { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: Document;
  date: string;
  slug: string;
  readTime: string;
  category: Category;
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  userImage: string;
  date: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

const calculateReadTime = (document: Document): string => {
  const text = documentToPlainTextString(document);
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} menit baca`;
};

const parseCategory = (categoryField: any): Category => {
  if (!categoryField) {
    return { id: "", name: "", slug: "", description: "" };
  }

  // Jika masih string lama
  if (typeof categoryField === "string") {
    return {
      id: "",
      name: categoryField,
      slug: categoryField.toLowerCase().replace(/\s+/g, "-"),
      description: "",
    };
  }

  // Reference entry Contentful
  if (categoryField?.fields) {
    return {
      id: categoryField.sys?.id || "",
      name: String(categoryField.fields.name || ""),
      slug: String(categoryField.fields.slug || ""),
      description: String(categoryField.fields.description || ""),
    };
  }

  return { id: "", name: "", slug: "", description: "" };
};

export async function getAllCategories(): Promise<Category[]> {
  const entries = await client.getEntries({
    content_type: "category",
  });

  return entries.items.map((item: any) => ({
    id: item.sys.id,
    name: String(item.fields.name || ""),
    slug: String(item.fields.slug || ""),
    description: String(item.fields.description || ""),
  }));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const entries = await client.getEntries({
    content_type: "category",
  });

  const found = entries.items.find(
    (item: any) => item.fields.slug === slug,
  ) as any;

  if (!found) return undefined;

  return {
    id: found.sys.id,
    name: String(found.fields.name || ""),
    slug: String(found.fields.slug || ""),
    description: String(found.fields.description || ""),
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const entries = await client.getEntries({
    content_type: "blogPost",
    order: ["-fields.date"] as any,
    include: 2,
  });

  return entries.items.map((item: any) => ({
    id: item.sys.id,
    title: item.fields.title,
    excerpt: item.fields.excerpt,
    content: item.fields.content,
    date: formatDate(item.fields.date),
    slug: item.fields.slug,
    readTime: calculateReadTime(item.fields.content),
    category: parseCategory(item.fields.category),
  }));
}

export async function getPostsByCategory(
  categorySlug: string,
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category || !category.id) return [];

  const entries = await client.getEntries({
    content_type: "blogPost",
    "fields.category.sys.id": category.id,
    order: ["-fields.date"] as any,
    include: 2,
  });

  return entries.items.map((item: any) => ({
    id: item.sys.id,
    title: item.fields.title,
    excerpt: item.fields.excerpt,
    content: item.fields.content,
    date: formatDate(item.fields.date),
    slug: item.fields.slug,
    readTime: calculateReadTime(item.fields.content),
    category: parseCategory(item.fields.category),
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const entries = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
    include: 2,
  });

  if (entries.items.length === 0) return undefined;

  const item: any = entries.items[0];
  return {
    id: item.sys.id,
    title: item.fields.title,
    excerpt: item.fields.excerpt,
    content: item.fields.content,
    date: formatDate(item.fields.date),
    slug: item.fields.slug,
    readTime: calculateReadTime(item.fields.content),
    category: parseCategory(item.fields.category),
  };
}

export async function getComments(slug: string): Promise<Comment[]> {
  const entries = await client.getEntries({
    content_type: "comment",
    "fields.postSlug": slug,
    order: ["-fields.date"] as any,
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
