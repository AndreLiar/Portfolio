"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header({ headerData, name, resumeUrl }: { headerData: any, name: string, resumeUrl: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#projects", label: headerData.projects },
    { href: "#skills", label: headerData.skills },
    { href: "#experience", label: headerData.experience },
    { href: "#contact", label: headerData.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="font-headline text-xl font-bold">
          {name}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button asChild>
            <a href={resumeUrl} download="ktayl_Resume.pdf">
              {headerData.downloadCv}
              <Download className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <Link href="/" className="font-headline text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                      {name}
                    </Link>
                    <SheetTrigger asChild>
                         <Button variant="ghost" size="icon">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </SheetTrigger>
                </div>
                <nav className="flex flex-col gap-4 text-base font-medium">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="transition-colors hover:text-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto space-y-4">
                   <Button asChild className="w-full">
                        <a href={resumeUrl} download="ktayl_Resume.pdf">
                        {headerData.downloadCv}
                        <Download className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
