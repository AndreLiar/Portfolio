"use client";

import { motion } from "framer-motion";
import { MapPin, Monitor, Cloud, Bot, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const locale = (pathname?.split("/")[1] || lang) as string;
  const resumeHref = `/${locale}/resume`;

  const skills = [
    {
      icon: Monitor,
      title: heroData.skills.fullstack.title,
      desc: heroData.skills.fullstack.desc
    },
    {
      icon: Cloud,
      title: heroData.skills.devops.title,
      desc: heroData.skills.devops.desc
    },
    {
      icon: Bot,
      title: heroData.skills.ai.title,
      desc: heroData.skills.ai.desc
    },
    {
      icon: BarChart3,
      title: heroData.skills.data.title,
      desc: heroData.skills.data.desc
    },
    {
      icon: Settings,
      title: heroData.skills.performance.title,
      desc: heroData.skills.performance.desc
    }
  ];

  return (
    <motion.section
      id="hero"
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-background flex flex-col justify-center min-h-[90vh]"
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
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-accent animate-gradient-x">
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
            <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-1"></span>
          </span>
        </motion.h2>

        {/* Location */}
        <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 text-muted-foreground mb-10">
          <div className="p-2 bg-primary/5 rounded-full">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-medium">{heroData.location}</span>
        </motion.div>

        {/* Main Description */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto mb-16">
          <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-6 font-light">
            {heroData.description1}
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {heroData.description2}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-20 flex-wrap">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 rounded-full">
            <a href="#projects">
              {heroData.buttons.viewProjects}
            </a>
          </Button>

          <Button size="lg" variant="outline" asChild className="border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary font-semibold px-8 py-6 text-lg transition-all duration-300 rounded-full hover:-translate-y-1">
            <Link href={resumeHref}>
              {heroData.buttons.downloadCV ?? "Download CV"}
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild className="border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary font-semibold px-8 py-6 text-lg transition-all duration-300 rounded-full hover:-translate-y-1">
            <a href="#skills">
              {heroData.buttons.techStack}
            </a>
          </Button>

          <Button size="lg" variant="ghost" asChild className="text-muted-foreground hover:text-foreground font-semibold px-8 py-6 text-lg transition-all duration-300 rounded-full hover:bg-muted/50">
            <a href="#contact">
              {heroData.buttons.letsConnect}
            </a>
          </Button>
        </motion.div>

        {/* What I Build */}
        <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px bg-border w-12 md:w-24"></div>
            <h3 className="text-2xl font-bold text-foreground uppercase tracking-widest text-sm">{heroData.whatIBuildTitle}</h3>
            <div className="h-px bg-border w-12 md:w-24"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 hover:bg-card/50 transition-all duration-300 shadow-sm hover:shadow-md text-left"
              >
                <div className="mb-6 p-3 bg-primary/5 rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
                  <skill.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{skill.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div variants={itemVariants} className="mt-20 opacity-80">
          <p className="text-lg md:text-xl text-primary/80 font-medium italic font-headline">
            "{heroData.tagline}"
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
