"use client";

import { motion } from "framer-motion";
import { MapPin, Monitor, Cloud, Bot, BarChart3, Settings } from "lucide-react";
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

export function Hero({ heroData }: { heroData: any }) {

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
      className="relative py-20 md:py-32 overflow-hidden bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <InteractiveBackground />
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Name */}
        <motion.h1 
          variants={itemVariants} 
          className="text-4xl md:text-6xl font-extrabold text-foreground mb-4"
        >
          {heroData.name}
        </motion.h1>
        
        {/* Title */}
        <motion.h2
          className="text-xl md:text-2xl font-bold text-muted-foreground mb-6 leading-relaxed"
          variants={itemVariants}
        >
          {heroData.title}{" "}
          <span className="text-primary">{heroData.titleHighlight}</span>
        </motion.h2>

        {/* Location */}
        <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 text-muted-foreground mb-8">
          <MapPin className="w-5 h-5" />
          <span className="text-lg">{heroData.location}</span>
        </motion.div>

        {/* Main Description */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
            {heroData.description1}
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {heroData.description2}
          </p>
        </motion.div>

        {/* What I Build */}
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">{heroData.whatIBuildTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300"
              >
                <skill.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="text-card-foreground font-semibold mb-2">{skill.title}</h4>
                <p className="text-muted-foreground text-sm">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div variants={itemVariants} className="mb-10">
          <p className="text-xl text-primary font-semibold italic">
            {heroData.tagline}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex justify-center flex-wrap gap-4">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
            <a href="#projects">
              {heroData.buttons.viewProjects}
            </a>
          </Button>
          
          <Button size="lg" variant="outline" asChild className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-3 transition-all duration-300">
            <a href="#skills">
              {heroData.buttons.techStack}
            </a>
          </Button>
          
          <Button size="lg" variant="ghost" asChild className="border border-border text-muted-foreground hover:text-foreground hover:border-foreground font-semibold px-8 py-3 transition-all duration-300">
            <a href="#contact">
              {heroData.buttons.letsConnect}
            </a>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
