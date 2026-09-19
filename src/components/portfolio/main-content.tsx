// src/components/portfolio/main-content.tsx
'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Heart,
  CheckCircle,
  Code,
  Cloud,
  Database,
  BrainCircuit,
  BotMessageSquare,
  Type,
  Users,
  Quote,
  Target,
  Server,
  GitBranch,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Header } from '@/components/portfolio/header';
import { Hero } from '@/components/portfolio/hero';
import { TimelineItem } from '@/components/portfolio/timeline-item';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { Badge } from '@/components/ui/badge';
import { ScrollToTop } from '@/components/portfolio/scroll-to-top';
import { ICON_VARIANTS } from '@/lib/icon-constants';

const ProjectList = dynamic(() => import('@/components/portfolio/project-list').then((m) => ({ default: m.ProjectList })), {
  ssr: true,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
          <div className="h-7 bg-muted rounded-md w-3/4 mb-4" />
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-4/5" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-6 bg-muted rounded-full w-16" />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
});

interface MainContentProps {
  messages: any;
  lang?: string;
  blogPosts?: any[];
  blogPostTags?: { [postId: string]: any[] };
}

const iconMap: { [key: string]: LucideIcon } = {
  Code,
  Cloud,
  Database,
  BrainCircuit,
  BotMessageSquare,
  Type,
  Users,
  Server,
  GitBranch,
  ShieldCheck,
  Activity,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function MainContent({ messages, lang = 'en', blogPosts = [], blogPostTags = {} }: MainContentProps) {
  const { data, Page, Header: headerData, Hero: heroData, ProjectList: projectListData, ProjectCard: projectCardData, ContactForm: contactFormData, Footer: footerData, Testimonials: testimonialsData, LookingFor: lookingForData, AvailableCTA: availableCTAData, Capabilities: capabilitiesData } = messages;

  const workExperience = data.workExperience;
  const education = data.education;
  const projects = data.projects;
  const languages = data.languages;
  const interests = data.interests;

  // The page renders its real content immediately (server-side) so the hero
  // heading is the Largest Contentful Paint at first paint. The previous
  // client-only <PageLoader> splash + opacity:0 fade meant nothing was
  // server-rendered and LCP waited ~2.9s for hydration — tanking Performance.
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main" tabIndex={0}>
        Skip to main content
      </a>

      <Header headerData={headerData} name={data.name} />
      <main id="main-content" className="flex-1 pt-16" tabIndex={-1}>
        <Hero heroData={heroData} />

        {/* Projects */}
        <motion.section
          id="projects"
          className="py-10 md:py-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-3">{Page.projects.title}</h2>
            {Page.projects.subtitle && (
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">{Page.projects.subtitle}</p>
            )}
            <ProjectList projects={projects} projectListData={projectListData} projectCardData={projectCardData} />
          </div>
        </motion.section>

        {/* Engineering Capabilities — four capability blocks (the detailed
            technology catalogue lives on the dedicated /skills page). */}
        {capabilitiesData?.blocks?.length > 0 && (
          <motion.section
            id="skills"
            className="py-10 md:py-16 bg-card"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-center mb-3">{capabilitiesData.title}</h2>
              {capabilitiesData.subtitle && (
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">{capabilitiesData.subtitle}</p>
              )}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {capabilitiesData.blocks.map((block: any, index: number) => {
                  const BlockIcon = iconMap[block.icon] || Code;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="rounded-xl border border-border/50 bg-background p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <BlockIcon className="w-5 h-5 text-primary" aria-hidden />
                        </div>
                        <h3 className="text-xl font-headline font-semibold">{block.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">{block.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {block.tech.map((tech: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-secondary/50 px-2.5 py-0.5 text-xs font-medium">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Experience */}
        <motion.section
          id="experience"
          className="py-10 md:py-16 bg-card"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">{Page.journey.title}</h2>
            <div className="relative max-w-2xl mx-auto">
              <h3 className="text-center my-8 flex items-center justify-center gap-2">
                <Briefcase className={ICON_VARIANTS.sectionHeader} /> {Page.journey.workExperienceTitle}
              </h3>
              <motion.div variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {workExperience.map((item: any, index: number) => (
                  <motion.div key={index} variants={itemVariants}>
                    <TimelineItem {...item} isLast={index === workExperience.length - 1} />
                  </motion.div>
                ))}
              </motion.div>

              <h3 className="text-2xl font-headline font-semibold text-center mt-16 mb-8 flex items-center justify-center gap-2">
                <GraduationCap className={ICON_VARIANTS.sectionHeader} /> {Page.journey.educationTitle}
              </h3>
              <motion.div variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {education.map((item: any, index: number) => (
                  <motion.div key={index} variants={itemVariants}>
                    <TimelineItem {...item} icon={GraduationCap} isLast={index === education.length - 1} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Extras */}
        <motion.section
          id="extras"
          className="py-10 md:py-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4 text-center">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-4">{Page.extras.languagesTitle}</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {languages.map((lang: any) => (
                    <Badge variant="secondary" key={lang.name} className="text-lg py-1 px-3">
                      {lang.name} ({lang.level})
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-headline font-semibold mb-4 flex items-center justify-center gap-2">
                  <Heart className={ICON_VARIANTS.sectionHeader} /> {Page.extras.interestsTitle}
                </h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {interests.map((interest: any) => (
                    <Badge variant="outline" key={interest} className="text-md py-1 px-3">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        {testimonialsData?.items?.length > 0 && (
          <motion.section
            id="testimonials"
            className="py-10 md:py-16 bg-card"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-center mb-12 flex items-center justify-center gap-2">
                <Quote className={ICON_VARIANTS.sectionHeader} aria-hidden />
                {testimonialsData.title}
              </h2>
              <motion.div
                className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {testimonialsData.items.map((t: any, i: number) => (
                  <motion.blockquote key={i} className="rounded-xl border border-border bg-background p-6 text-left" variants={itemVariants}>
                    <p className="text-muted-foreground italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                    <footer className="text-sm font-medium text-foreground">
                      — {t.author}{t.role ? `, ${t.role}` : ''}
                    </footer>
                  </motion.blockquote>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* What I'm looking for */}
        {lookingForData?.items?.length > 0 && (
          <motion.section
            id="looking-for"
            className="py-10 md:py-16"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-center mb-6 flex items-center justify-center gap-2">
                <Target className={ICON_VARIANTS.sectionHeader} aria-hidden />
                {lookingForData.title}
              </h2>
              {lookingForData.subtitle && (
                <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">{lookingForData.subtitle}</p>
              )}
              <motion.ul
                className="max-w-2xl mx-auto space-y-3"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {lookingForData.items.map((item: string, i: number) => (
                  <motion.li key={i} className="flex items-start gap-3" variants={itemVariants}>
                    <CheckCircle className={`${ICON_VARIANTS.feature} mt-0.5 flex-shrink-0 text-primary`} aria-hidden />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.section>
        )}

        {/* Contact */}
        <motion.section
          id="contact"
          className="py-10 md:py-16 bg-subtle-gradient"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-2">{Page.contact.title}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-loose">{Page.contact.subtitle}</p>
            </div>
            <Contact contactFormData={contactFormData} contactEmail={data.contact?.email} />
          </div>
        </motion.section>
      </main>

      {/* Available for opportunities banner */}
      {availableCTAData && (
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{availableCTAData.title}</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              {availableCTAData.subtitle}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary font-semibold px-8 py-3 rounded-xl hover:bg-primary-foreground/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
            >
              {availableCTAData.cta} →
            </a>
          </div>
        </section>
      )}

      <Footer footerData={footerData} data={data} />
      <ScrollToTop />
    </div>
  );
}
