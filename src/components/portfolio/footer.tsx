"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICON_VARIANTS } from "@/lib/icon-constants";

export function Footer({ footerData, data }: { footerData: any; data: any }) {
  const [year, setYear] = useState<number>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const copyEmail = () => {
    const email = data?.contact?.email;
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer className="bg-card border-t border-border/50 py-12 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            &copy; {year} <span className="font-semibold text-foreground">{data.name}</span>. {footerData.rights}
          </p>
          {data?.contact?.email && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" aria-hidden />
              <a href={`mailto:${data.contact.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {data.contact.email}
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={copyEmail}
                aria-label={footerData.copyEmail ?? "Copy email"}
                title={footerData.copyEmail ?? "Copy email"}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground/60">
            Built with Next.js, Tailwind CSS & Framer Motion
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:-translate-y-1">
            <a href={data.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <Github className={`${ICON_VARIANTS.social} w-5 h-5`} />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:-translate-y-1">
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <Linkedin className={`${ICON_VARIANTS.social} w-5 h-5`} />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
