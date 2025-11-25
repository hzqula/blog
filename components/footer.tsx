import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg uppercase mb-4">Muhammad Faruq</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Isinya banyakan absurd, teknologi, absurd, review buku, dan
              absurd.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Halaman</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                Cover
              </Link>
              <Link
                href="/blog"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                Tentang
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Tautkan</h4>
            <div className="flex items-center gap-3">
              <Link
                href="mailto:hellhzqoolao@gmail.com"
                className="w-9 h-9 border border-background/30 flex items-center justify-center hover:border-background hover:bg-background hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com/muhammadfaruq.hz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-background/30 flex items-center justify-center hover:border-background hover:bg-background hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/hzqula"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-background/30 flex items-center justify-center hover:border-background hover:bg-background hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com/muhammad-faruq-hz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-background/30 flex items-center justify-center hover:border-background hover:bg-background hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/20 text-center">
          <p className="text-xs text-background/50">
            © {new Date().getFullYear()} Muhammad Faruq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
