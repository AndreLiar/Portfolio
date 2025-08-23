"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
    { href: `/${pathname.split('/')[1]}/blog`, label: headerData.blog || 'Blog', external: true },
    { href: "#contact", label: headerData.contact },
  ];

  const LanguageSwitcher = () => (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Change language" aria-haspopup="menu">
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="font-headline font-bold text-xl leading-tight">
          {name}
        </Link>
        <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-6 text-body-sm font-medium" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = link.external ? pathname.includes('/blog') : activeSection === link.href.substring(1);
              const Component = link.external ? Link : 'a';
              
              return (
                <Component
                key={link.href}
                href={link.href}
                className={`transition-all duration-200 hover:text-accent relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1 ${
                  isActive 
                    ? 'text-accent font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={0}
                >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent rounded-full" aria-hidden="true" />
                )}
                </Component>
              );
            })}
            </nav>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open main menu" aria-expanded={isMobileMenuOpen}>
                    <Menu className={ICON_VARIANTS.navigation} aria-hidden="true" />
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] flex flex-col" aria-label="Mobile navigation menu">
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                      <Link href="/" className="font-headline font-bold leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                        {name}
                      </Link>
                      <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Close menu">
                              <X className={ICON_VARIANTS.navigation} aria-hidden="true" />
                          </Button>
                      </SheetTrigger>
                  </div>
                  <nav className="flex flex-col gap-2 font-medium" role="navigation" aria-label="Mobile main navigation">
                    {navLinks.map((link) => {
                      const isActive = link.external ? pathname.includes('/blog') : activeSection === link.href.substring(1);
                      const Component = link.external ? Link : 'a';
                      
                      return (
                      <Component
                        key={link.href}
                        href={link.href}
                        className={`transition-all duration-200 hover:text-accent p-4 -mx-2 rounded-md relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[48px] flex items-center ${
                          isActive 
                            ? 'text-accent font-semibold bg-accent/10' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        tabIndex={0}
                      >
                        {link.label}
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" aria-hidden="true" />
                        )}
                      </Component>
                      );
                    })}
                  </nav>
                  <div className="mt-auto pt-4 border-t">
                     <p className="text-body-sm text-muted-foreground mb-3 leading-relaxed font-medium">{headerData.language}</p>
                     <nav className="flex flex-col gap-1 font-medium" role="navigation" aria-label="Language selection">
                        {locales.map((locale) => (
                           <Link
                              key={locale.code}
                              href={redirectedPathName(locale.code)}
                              className="transition-colors hover:text-accent p-3 -mx-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[48px] flex items-center"
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
