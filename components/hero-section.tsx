import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-[auto_1fr] gap-12 items-center">
        {/* Illustration */}
        <div className="flex justify-center md:justify-start order-0">
          <div className="w-full md:w-138 border-2 border-foreground">
            <Image
              src="/avatar-illustration.png"
              alt="Personal illustration"
              width={1000}
              height={1000}
              loading="eager"
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
        {/* Text content */}
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold leading-tight mb-6">
            Hai, gue <span className="text-primary">Muhammad Faruq</span>
          </h1>
          <p className="text-foreground/80 leading-relaxed mb-4 text-justify">
            Ini blog baru—yang mungkin sudah nggak baru lagi pas kalian
            baca—yang biasa gue anggap "Mesin Waktu". Di sini juga jadi tempat
            tersiksanya pikiran dan jari-jemari agar bisa menghasilkan tulisan
            yang—anggap aja—bermanfaat. Hehe.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 text-justify">
            Selamat datang di blog yang biasa gue anggap sebagai "Mesin Waktu"
            ini. Ya, secara ajaib dan pribadi bisa membawa gue ke waktu dan
            tempat yang ditentukan.
          </p>
          <Button
            asChild
            variant="outline"
            className="group border-2 border-foreground hover:bg-foreground hover:text-background bg-transparent"
          >
            <Link href="/about">
              Selengkapnya
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
