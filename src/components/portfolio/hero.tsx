"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { ICON_VARIANTS } from "@/lib/icon-constants";
import { InteractiveBackground } from "./interactive-background";
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const sentenceVariant = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.4,
      staggerChildren: 0.03,
    },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function Hero({ heroData, data }: { heroData: any, data: any }) {
  const title = data.title;
  const titleParts = title.split(' | ');
  const firstPart = titleParts[0];
  const secondPart = titleParts[1] ? ` | ${titleParts[1]}` : '';

  return (
    <motion.section 
      id="hero" 
      className="relative py-20 md:py-32 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <InteractiveBackground />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1 variants={itemVariants} className="mb-4">
          {data.fullName}
        </motion.h1>
        
        <motion.h2
          className="font-body font-medium mb-6 min-h-[56px] md:min-h-[32px] text-xl md:text-2xl leading-relaxed tracking-tight"
          variants={sentenceVariant}
          initial="hidden"
          animate="visible"
          aria-label={title}
        >
          {firstPart.split("").map((char: string, index: number) => (
            <motion.span key={`p1-${index}`} variants={letterVariant} aria-hidden="true">
              {char}
            </motion.span>
          ))}
          <span className="text-primary">
            {secondPart.split("").map((char: string, index: number) => (
              <motion.span key={`p2-${index}`} variants={letterVariant} aria-hidden="true">
                {char}
              </motion.span>
            ))}
          </span>
        </motion.h2>

        <motion.div variants={itemVariants} className="flex justify-center items-center gap-4 text-muted-foreground mb-8">
          <div className="flex items-center gap-2" role="complementary" aria-label="Location information">
            <MapPin className={ICON_VARIANTS.button} aria-hidden="true" />
            <span>{data.location}</span>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-body-lg text-muted-foreground mb-10 leading-looser">
          <Markdown className="text-center">{data.summary}</Markdown>
        </motion.div>
        <motion.div variants={itemVariants} className="flex justify-center flex-wrap gap-4" role="group" aria-label="Contact and social links">
          {/* Primary CTA - Contact Me */}
          <Button size="lg" asChild className="min-h-[52px] px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            <a href="#contact" aria-describedby="contact-description" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2">
              <Mail className={`mr-3 ${ICON_VARIANTS.button}`} aria-hidden="true" /> {heroData.contactMe}
            </a>
          </Button>
          <span id="contact-description" className="sr-only">Navigate to contact form section</span>
          
          {/* Secondary CTAs - Social Links */}
          <Button size="lg" variant="outline" asChild className="min-h-[52px] px-6 border-2 hover:bg-muted/50 transition-all duration-200">
            <a href={data.contact.github} target="_blank" rel="noopener noreferrer" aria-label={`View GitHub profile (opens in new tab)`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <Github className={`mr-2 ${ICON_VARIANTS.button}`} aria-hidden="true" /> {heroData.github}
            </a>
          </Button>
          
           <Button size="lg" variant="outline" asChild className="min-h-[52px] px-6 border-2 hover:bg-muted/50 transition-all duration-200">
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`View LinkedIn profile (opens in new tab)`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <Linkedin className={`mr-2 ${ICON_VARIANTS.button}`} aria-hidden="true" /> {heroData.linkedin}
            </a>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
