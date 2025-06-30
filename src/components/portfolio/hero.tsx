"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className="py-20 md:py-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-headline font-bold mb-4">
          {data.fullName}
        </motion.h1>
        
        <motion.h2
          className="text-xl md:text-2xl font-semibold mb-6 min-h-[56px] md:min-h-[32px]"
          variants={sentenceVariant}
          initial="hidden"
          animate="visible"
          aria-label={title}
        >
          {firstPart.split("").map((char, index) => (
            <motion.span key={`p1-${index}`} variants={letterVariant} aria-hidden="true">
              {char}
            </motion.span>
          ))}
          <span className="text-primary">
            {secondPart.split("").map((char, index) => (
              <motion.span key={`p2-${index}`} variants={letterVariant} aria-hidden="true">
                {char}
              </motion.span>
            ))}
          </span>
        </motion.h2>

        <motion.div variants={itemVariants} className="flex justify-center items-center gap-4 text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{data.location}</span>
          </div>
        </motion.div>
        <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-base md:text-lg text-muted-foreground mb-10">
          {data.summary}
        </motion.p>
        <motion.div variants={itemVariants} className="flex justify-center flex-wrap gap-4">
          <Button size="lg" asChild>
            <a href="#contact">
              <Mail className="mr-2 h-4 w-4" /> {heroData.contactMe}
            </a>
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
        </motion.div>
      </div>
    </motion.section>
  );
}
