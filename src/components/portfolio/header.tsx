"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

import { ICON_VARIANTS } from "@/lib/icon-constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function Header({ headerData, name }: { headerData: any, name: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1)); // Remove '#'
      const scrollPosition = window.scrollY + 100; // Offset for header height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }

      // Special case for hero section
      if (scrollPosition < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { href: `/${pathname.split('/')[1]}/resume`, label: "Resume", external: true },
    { href: "#contact", label: headerData.contact },
  ];

  const LanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Change language"
          aria-haspopup="menu"
        >
          <Globe className={ICON_VARIANTS.navigation} aria-hidden="true" />
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
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${activeSection
        ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm"
        : "bg-background/60 backdrop-blur-sm border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
        <Link
          href="/"
          className="font-headline font-bold text-2xl leading-tight tracking-tight hover:opacity-80 transition-opacity"
        >
          {name}
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1 text-body-sm font-medium" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = link.external ? pathname.includes('/resume') : activeSection === link.href.substring(1);
              const Component = link.external ? Link : 'a';

              return (
                <Component
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full transition-all duration-300 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isActive
                    ? 'text-primary font-semibold bg-primary/5'
                    : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={0}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-primary/5 -z-10" aria-hidden="true" />
                  )}
                </Component>
              );
            })}
          </nav>
          <div className="hidden md:block pl-2 border-l border-border/50">
            <LanguageSwitcher />
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open main menu" aria-expanded={isMobileMenuOpen} className="hover:bg-primary/5">
                  <Menu className={ICON_VARIANTS.navigation} aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] flex flex-col border-l border-border/50 shadow-2xl" aria-label="Mobile navigation menu">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex justify-between items-center border-b border-border/50 pb-6 mb-6">
                  <Link href="/" className="font-headline font-bold text-xl leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                    {name}
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu" className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <X className={ICON_VARIANTS.navigation} aria-hidden="true" />
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col gap-2 font-medium" role="navigation" aria-label="Mobile main navigation">
                  {navLinks.map((link) => {
                    const isActive = link.external ? pathname.includes('/resume') : activeSection === link.href.substring(1);
                    const Component = link.external ? Link : 'a';

                    return (
                      <Component
                        key={link.href}
                        href={link.href}
                        className={`transition-all duration-200 px-4 py-3 rounded-xl relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-between group ${isActive
                          ? 'text-primary font-semibold bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        tabIndex={0}
                      >
                        {link.label}
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                        )}
                      </Component>
                    );
                  })}
                </nav>
                <div className="mt-auto pt-6 border-t border-border/50">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-semibold">{headerData.language}</p>
                  <nav className="grid grid-cols-2 gap-2" role="navigation" aria-label="Language selection">
                    {locales.map((locale) => (
                      <Link
                        key={locale.code}
                        href={redirectedPathName(locale.code)}
                        className="transition-all hover:border-primary/50 border border-transparent bg-muted/30 hover:bg-muted/50 p-3 rounded-lg text-center text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                        tabIndex={0}
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
