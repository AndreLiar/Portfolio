"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICON_VARIANTS } from "@/lib/icon-constants";

export function Footer({ footerData, data }: { footerData: any, data: any }) {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
          &copy; {year} {data.name}. {footerData.rights}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href={data.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className={ICON_VARIANTS.social} />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className={ICON_VARIANTS.social} />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
