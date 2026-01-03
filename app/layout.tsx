import type React from "react";
import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });
const sourceSerif = Source_Serif_4({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://muhammadfaruq.me"),
  title: "Muhammad Faruq",
  description:
    'Ini blog baru—yang mungkin sudah nggak baru lagi pas kalian baca—yang biasa gue anggap "Mesin Waktu". Di sini juga jadi tempat tersiksanya pikiran dan jari-jemari agar bisa ngehasilin tulisan yang—anggap aja—bermanfaat. Hehe.',
  icons: {
    icon: "/logo.svg",
  },
  keywords: ["muhammad faruq", "muhammad faruq blog", "cerita absurd"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
          <GoogleAnalytics gaId={process.env.GOOGLE_MEASUREMENT_ID!} />
        </AuthProvider>
      </body>
    </html>
  );
}
