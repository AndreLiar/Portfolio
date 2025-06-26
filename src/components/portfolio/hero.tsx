"use client";

import Link from "next-intl/link";
import { useTranslations } from "next-intl";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations();
  const data = t.raw('data') as any;
  const heroData = t.raw('Hero') as any;

  return (
    <section id="hero" className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
          {data.fullName}
        </h1>
        <h2 className="text-xl md:text-2xl text-accent font-semibold mb-6">
          {data.title}
        </h2>
        <div className="flex justify-center items-center gap-4 text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{data.location}</span>
          </div>
        </div>
        <p className="max-w-3xl mx-auto text-base md:text-lg text-muted-foreground mb-10">
          {data.summary}
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link href="#contact">
              <Mail className="mr-2 h-4 w-4" /> {heroData.contactMe}
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <a href={data.contact.github} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> {heroData.github}
            </a>
          </Button>
           <Button size="lg" variant="secondary" asChild>
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" /> {heroData.linkedin}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
