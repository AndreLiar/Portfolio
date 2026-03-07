// src/components/portfolio/main-content.tsx
'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Header } from '@/components/portfolio/header';
import { Hero } from '@/components/portfolio/hero';
import { SkillCard } from '@/components/portfolio/skill-card';
import { TimelineItem } from '@/components/portfolio/timeline-item';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { Badge } from '@/components/ui/badge';
import { PageLoader } from '@/components/portfolio/page-loader';
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
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const { data, Page, Header: headerData, Hero: heroData, ProjectList: projectListData, ProjectCard: projectCardData, ContactForm: contactFormData, Footer: footerData, Testimonials: testimonialsData, LookingFor: lookingForData } = messages;

  // Separate technical skills (with subcategories) from soft skills
  const technicalSkills = data.skills.filter((skill: any) => skill.title !== 'Professional & Soft Skills');
  const softSkillsCategory = data.skills.find((skill: any) => skill.title === 'Professional & Soft Skills');
  // Use category from data.skills if present, otherwise use standalone data.softSkills (used in FR/DE locales)
  const softSkills = (softSkillsCategory?.skills?.length ? softSkillsCategory.skills : data.softSkills) || [];
  const skillsWithIcons = technicalSkills.map((skill: any) => ({
    ...skill,
    Icon: iconMap[skill.icon] || Code,
  }));

  const workExperience = data.workExperience;
  const education = data.education;
  const projects = data.projects;
  const languages = data.languages;
  const interests = data.interests;

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  // Get initials for loader
  const getInitials = (fullName: string) =>
    fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) {
    return (
      <PageLoader onComplete={handleLoadingComplete} name={getInitials(data.fullName)} />
    );
  }

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
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
            <h2 className="text-center mb-12">{Page.projects.title}</h2>
            <ProjectList projects={projects} projectListData={projectListData} projectCardData={projectCardData} />
          </div>
        </motion.section>

        {/* Technical Skills */}
        <motion.section
          id="skills"
          className="py-10 md:py-16 bg-card bg-dots-pattern"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">{Page.skills.title}</h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {skillsWithIcons.map((skillCategory: any, index: number) => (
                <motion.div key={index} variants={itemVariants}>
                  <SkillCard {...skillCategory} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Soft Skills */}
        <motion.section
          id="soft-skills"
          className="py-10 md:py-16 bg-grid-pattern"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">{Page.softSkills.title}</h2>
            <div className="max-w-3xl mx-auto">
              <motion.ul
                className="space-y-4"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {softSkills.map((skill: string, index: number) => (
                  <motion.li key={index} className="flex items-start text-left" variants={itemVariants}>
                    <CheckCircle className={`${ICON_VARIANTS.feature} mr-4 mt-1 flex-shrink-0`} />
                    <span className="text-body-lg text-muted-foreground leading-loose">{skill}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          id="experience"
          className="py-10 md:py-16 bg-card bg-geometric-pattern"
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
            className="py-10 md:py-16 bg-card bg-dots-pattern"
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
            className="py-10 md:py-16 bg-grid-pattern"
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
      <Footer footerData={footerData} data={data} />
      <ScrollToTop />
    </motion.div>
  );
}
