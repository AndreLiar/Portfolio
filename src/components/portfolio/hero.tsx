"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractiveBackground } from "./interactive-background";

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

export function Hero({ heroData, lang = "en" }: { heroData: any; lang?: string }) {
  return (
    <motion.section
      id="hero"
      className="relative py-20 md:py-28 overflow-hidden bg-background flex flex-col justify-center min-h-[70vh]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <InteractiveBackground />
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {heroData.name}
          </span>
        </motion.h1>

        {/* Title */}
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground mb-8 leading-relaxed"
          variants={itemVariants}
        >
          {heroData.title}{" "}
          <span className="text-primary relative inline-block">
            {heroData.titleHighlight}
            <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-1" />
          </span>
        </motion.h2>

        {/* Location */}
        <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 text-muted-foreground mb-10">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <span className="text-base font-medium">{heroData.location}</span>
        </motion.div>

        {/* Main Description */}
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-4 font-light">
            {heroData.description1}
          </p>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {heroData.description2}
          </p>
        </motion.div>

        {/* Metrics band */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch justify-center max-w-lg mx-auto mb-10 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
          {[
            { value: "4+", label: heroData.metrics?.years ?? "Years building" },
            { value: "10+", label: heroData.metrics?.projects ?? "Projects shipped" },
            { value: "3", label: heroData.metrics?.domains ?? "Engineering domains" },
          ].map((metric, i) => (
            <div
              key={i}
              className={`flex-1 text-center py-5 px-6 ${i < 2 ? "sm:border-r border-b sm:border-b-0 border-border/40" : ""}`}
            >
              <p className="text-3xl font-extrabold text-primary leading-none">{metric.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium uppercase tracking-wide">{metric.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-6 text-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 rounded-xl">
            <a href="#projects">
              {heroData.buttons.viewProjects}
            </a>
          </Button>

          <Button size="lg" variant="outline" asChild className="border-2 border-primary/50 text-primary hover:bg-primary/5 hover:border-primary font-semibold px-10 py-6 text-lg transition-all duration-300 rounded-xl hover:-translate-y-1">
            <a href="#contact">
              {heroData.contactMe}
            </a>
          </Button>
        </motion.div>

        {/* Tagline */}
        <motion.div variants={itemVariants} className="opacity-60">
          <p className="text-base md:text-lg text-muted-foreground font-medium italic font-headline">
            &ldquo;{heroData.tagline}&rdquo;
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
