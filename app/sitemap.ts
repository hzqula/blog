// app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://muhammadfaruq.me";

  try {
    const posts = await getAllPosts();

    const blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      // ✅ Gunakan updatedAt dari sys (aman dari timezone issue)
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.5,
      },
      ...blogPosts,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
    ];
  }
}
