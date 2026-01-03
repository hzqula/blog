import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://muhammadfaruq.me";

  try {
    const posts = await getAllPosts();

    const blogPosts = posts
      .map((post) => {
        // Validasi date dengan berbagai fallback
        let lastModified: Date;

        try {
          // Coba parse date dari post
          if (post.date) {
            const parsedDate = new Date(post.date);
            // Cek apakah date valid
            if (!isNaN(parsedDate.getTime())) {
              lastModified = parsedDate;
            } else {
              // Jika invalid, gunakan tanggal sekarang
              console.warn(`Invalid date for post ${post.slug}: ${post.date}`);
              lastModified = new Date();
            }
          } else {
            // Jika tidak ada date, gunakan tanggal sekarang
            console.warn(`No date for post ${post.slug}`);
            lastModified = new Date();
          }
        } catch (error) {
          // Jika ada error saat parsing, gunakan tanggal sekarang
          console.error(`Error parsing date for post ${post.slug}:`, error);
          lastModified = new Date();
        }

        return {
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        };
      })
      .filter(Boolean); // Hapus entry yang undefined/null

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

    // Fallback: return static sitemap jika ada error
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
    ];
  }
}
