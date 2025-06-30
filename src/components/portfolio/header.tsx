"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function Header({ headerData, name }: { headerData: any, name: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const locales = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  const navLinks = [
    { href: "#projects", label: headerData.projects },
    { href: "#skills", label: headerData.skills },
    { href: "#soft-skills", label: headerData.softSkills },
    { href: "#experience", label: headerData.experience },
    { href: "#contact", label: headerData.contact },
  ];

  const LanguageSwitcher = () => (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {locales.map((locale) => (
                <DropdownMenuItem asChild key={locale.code}>
                    <Link href={redirectedPathName(locale.code)}>
                        {locale.name}
                    </Link>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="font-headline text-xl font-bold">
          {name}
        </Link>
        <div className="flex items-center gap-2">
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
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] flex flex-col">
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
                  <div className="mt-auto pt-4 border-t">
                     <p className="text-sm text-muted-foreground mb-2">{headerData.language}</p>
                     <nav className="flex flex-col gap-2 text-base font-medium">
                        {locales.map((locale) => (
                           <Link
                              key={locale.code}
                              href={redirectedPathName(locale.code)}
                              className="transition-colors hover:text-accent p-2 -mx-2 rounded-md"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {locale.name}
                            </Link>
                        ))}
                     </nav>
                  </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
