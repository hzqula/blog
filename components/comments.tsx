"use client";

import { DiscussionEmbed } from "disqus-react";
import { useTheme } from "next-themes";

interface CommentsProps {
  post: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function Comments({ post }: CommentsProps) {
  const { theme } = useTheme();

  // Ganti dengan shortname dari akun Disqus Anda
  const disqusShortname = "muhammadfaruq";

  const disqusConfig = {
    url: `https://muhammadfaruq.vercel.app/blog/${post.slug}`,
    identifier: post.id,
    title: post.title,
    language: "id",
  };

  return (
    <div className="mt-10 p-6 bg-card border border-border rounded-lg">
      <DiscussionEmbed
        key={theme + post.id}
        shortname={disqusShortname}
        config={disqusConfig}
      />
    </div>
  );
}
