import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg uppercase mb-4">Your Name</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Writer, designer, and creative thinker sharing ideas through words.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigate</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-background/70 hover:text-background transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-sm text-background/70 hover:text-background transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm text-background/70 hover:text-background transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              <Link
                href="mailto:hello@example.com"
                className="w-9 h-9 border border-background/30 flex items-center justify-center hover:border-background hover:bg-background hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-background/30 flex items-center justify-center hover:border-background hover:bg-background hover:text-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-background/30 flex items-center justify-center hover:border-background hover:bg-background hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
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
          <p className="text-xs text-background/50">© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
