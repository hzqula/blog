import type React from "react";
import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });
const sourceSerif = Source_Serif_4({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muhammad Faruq",
  description:
    'Ini blog baru—yang mungkin sudah nggak baru lagi pas kalian baca—yang biasa gue anggap "Mesin Waktu". Di sini juga jadi tempat tersiksanya pikiran dan jari-jemari agar bisa menghasilkan tulisan yang—anggap aja—bermanfaat. Hehe.',
  icons: {
    icon: "/logo.svg",
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
        </AuthProvider>
      </body>
    </html>
  );
}
