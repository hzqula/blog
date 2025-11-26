import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b-2 border-foreground bg-background">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="w-1/2 md:w-lg">
          <Link
            href="/"
            className="text-sm lg:text-xl  font-serif font-bold tracking-tight uppercase flex items-center gap-3"
          >
            Muhammad Faruq
            <Image
              src="/logo.svg"
              alt="Logo"
              width={500}
              height={500}
              loading="eager"
              className="object-contain w-8 lg:w-10 h-auto"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Cover
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Tentang
          </Link>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Search className="h-4 w-4" />
          </Button>
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex items-center flex-col gap-4 mt-8">
              <Link
                href="/"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
