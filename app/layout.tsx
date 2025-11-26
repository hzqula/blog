import type React from "react";
import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });
const sourceSerif = Source_Serif_4({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Personal Blog",
  description: "A personal blog about technology, design, and life.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
