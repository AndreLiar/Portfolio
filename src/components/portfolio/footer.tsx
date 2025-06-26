"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin } from "lucide-react";
import { data } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
          &copy; {year} {data.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href={data.contact.github.url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={data.contact.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
