import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Mail, Github, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-12">
              Tentang Gue
            </h1>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1 space-y-5">
                <p className="text-lg leading-relaxed">
                  Halo! Gue{" "}
                  <span className="text-primary font-medium">
                    Muhammad Faruq
                  </span>
                  .
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Selamat datang di blog yang biasa gue anggap sebagai "Mesin
                  Waktu" ini. Ini adalah sudut kecil di internet tempat gue
                  latihan nulis, membaca, dan mendokumentasikan hal-hal yang gue
                  pelajari.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Isi blog ini mungkin agak campur aduk. Mulai dari teknologi
                  (karena gue pengen), review buku yang habis gue baca, hingga
                  tulisan-tulisan absurd yang muncul di kepala. Gue berusaha
                  menyuguhkan tulisan dengan tipografi yang nyaman dibaca,
                  dominan serif dan sans-serif.
                </p>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-border">
              <h2 className="text-xl font-serif font-semibold mb-6">
                Topik Tulisan
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Teknologi",
                  "Review Buku",
                  "Cerita Absurd",
                  "Catatan Belajar",
                  "Opini",
                  "Jurnal",
                ].map((topic) => (
                  <div
                    key={topic}
                    className="bg-secondary/50 rounded-lg px-4 py-3 text-sm font-medium text-center"
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
