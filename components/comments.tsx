// components/comments.tsx
"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function Comments() {
  const { theme } = useTheme();

  return (
    <div className="mt-10">
      <Giscus
        id="comments"
        repo="hzqula/blog-comments"
        repoId="R_kgDOQdIszA."
        category="General"
        categoryId="DIC_kwDOQdIszM4CzC3d"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === "dark" ? "dark" : "light"}
        lang="id"
        loading="lazy"
      />
    </div>
  );
}
