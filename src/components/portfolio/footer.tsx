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
    <footer className="bg-foreground text-background py-16 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-background/70">
            &copy; {year} <span className="font-semibold text-background">{data.name}</span>. {footerData.rights}
          </p>
          {data?.contact?.email && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-background/60" aria-hidden />
              <a href={`mailto:${data.contact.email}`} className="text-sm text-background/70 hover:text-background transition-colors">
                {data.contact.email}
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-background/70 hover:text-background hover:bg-white/10"
                onClick={copyEmail}
                aria-label={footerData.copyEmail ?? "Copy email"}
                title={footerData.copyEmail ?? "Copy email"}
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full text-background/70 transition-colors hover:bg-white/10 hover:text-background">
            <a href={data.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <Github className={`${ICON_VARIANTS.social} w-5 h-5`} />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full text-background/70 transition-colors hover:bg-white/10 hover:text-background">
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <Linkedin className={`${ICON_VARIANTS.social} w-5 h-5`} />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
