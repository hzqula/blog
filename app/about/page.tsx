import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-12">
              Tentang Blog Ini
            </h1>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1 space-y-5">
                <p className="text-lg leading-relaxed">
                  Ditulis Oleh{" "}
                  <span className="text-primary font-medium">
                    Muhammad Faruq
                  </span>
                  .
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Ini blog baru—yang mungkin sudah nggak baru lagi pas kalian
                  baca—yang biasa gue anggap "Mesin Waktu". Di sini juga jadi
                  tempat tersiksanya pikiran dan jari-jemari agar bisa
                  menghasilkan tulisan yang—anggap aja—bermanfaat. Hehe.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Selamat datang di blog yang biasa gue anggap sebagai "Mesin
                  Waktu" ini. Ya, secara ajaib dan pribadi bisa membawa gue ke
                  waktu dan tempat yang ditentukan.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Isi blog ini membahas semua yang bisa gue bahas, dan tentunya
                  sesuai dengan batas yang sudah dikasih. Apa value yang bakal
                  didapat dari baca tulisan-tulisan di sini? Yang gue harap sih,
                  bisa hilangin beban pikiran selama menit yang tercantum di
                  tiap tulisannya. Tapi setelah itu yaa muncul lagi. Jika
                  beruntung, pembaca juga bisa ikut dalam mesin waktu ini,
                  selama persyaratan teknisnya terpenuhi. Hehe.
                </p>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-border">
              <h2 className="text-xl font-serif font-semibold mb-6">
                Topik Tulisan
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Lagi Nggak Mikir",
                  "Lagi Mikir",
                  "Review Buku",
                  "Ngasih Tau",
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
