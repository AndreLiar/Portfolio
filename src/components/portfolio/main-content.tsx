'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Header } from '@/components/portfolio/header';
import { Hero } from '@/components/portfolio/hero';
import { SkillCard } from '@/components/portfolio/skill-card';
import { TimelineItem } from '@/components/portfolio/timeline-item';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { Badge } from '@/components/ui/badge';
import { ProjectList } from '@/components/portfolio/project-list';
import { PageLoader } from '@/components/portfolio/page-loader';
import { ScrollToTop } from '@/components/portfolio/scroll-to-top';
import { ICON_VARIANTS } from '@/lib/icon-constants';

interface MainContentProps {
  messages: any;
}

const iconMap: { [key: string]: LucideIcon } = {
  Code,
  Cloud,
  Database,
  BrainCircuit,
  BotMessageSquare,
  Type,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
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

export function MainContent({ messages }: MainContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const { data, Page, Header: headerData, Hero: heroData, ProjectList: projectListData, ProjectCard: projectCardData, ContactForm: contactFormData, Footer: footerData } = messages;

  const skillsWithIcons = data.skills.map((skill: any) => ({
    ...skill,
    Icon: iconMap[skill.Icon],
  }));

  const workExperience = data.workExperience;
  const education = data.education;
  const projects = data.projects;
  const languages = data.languages;
  const interests = data.interests;
  const softSkills = data.softSkills;

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  // Get initials for loader
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <PageLoader 
        onComplete={handleLoadingComplete}
        name={getInitials(data.fullName)}
      />
    );
  }

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-main"
        tabIndex={0}
      >
        Skip to main content
      </a>
      
      <Header
        headerData={headerData}
        name={data.name}
      />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Hero
          heroData={heroData}
          data={data}
        />

        <motion.section 
          id="projects" 
          className="py-16 md:py-24"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">
              {Page.projects.title}
            </h2>
            <ProjectList 
              projects={projects}
              projectListData={projectListData}
              projectCardData={projectCardData}
            />
          </div>
        </motion.section>

        <motion.section 
          id="skills" 
          className="py-16 md:py-24 bg-card bg-dots-pattern"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">
              {Page.skills.title}
            </h2>
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

        <motion.section 
          id="soft-skills" 
          className="py-16 md:py-24 bg-grid-pattern"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">
              {Page.softSkills.title}
            </h2>
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

        <motion.section 
          id="experience" 
          className="py-16 md:py-24 bg-card bg-geometric-pattern"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">
              {Page.journey.title}
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <h3 className="text-center my-8 flex items-center justify-center gap-2">
                <Briefcase className={ICON_VARIANTS.sectionHeader} />{' '}
                {Page.journey.workExperienceTitle}
              </h3>
              <motion.div variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {workExperience.map((item: any, index: number) => (
                    <motion.div key={index} variants={itemVariants}>
                    <TimelineItem {...item} />
                    </motion.div>
                ))}
              </motion.div>

              <h3 className="text-2xl font-headline font-semibold text-center mt-16 mb-8 flex items-center justify-center gap-2">
                <GraduationCap className={ICON_VARIANTS.sectionHeader} /> {Page.journey.educationTitle}
              </h3>
               <motion.div variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {education.map((item: any, index: number) => (
                    <motion.div key={index} variants={itemVariants}>
                    <TimelineItem {...item} icon={GraduationCap} />
                    </motion.div>
                ))}
                </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="extras" 
          className="py-16 md:py-24"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4 text-center">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-4">
                  {Page.extras.languagesTitle}
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {languages.map((lang: any) => (
                    <Badge
                      variant="secondary"
                      key={lang.name}
                      className="text-lg py-1 px-3"
                    >
                      {lang.name} ({lang.level})
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-headline font-semibold mb-4 flex items-center justify-center gap-2">
                  <Heart className={ICON_VARIANTS.sectionHeader} />{' '}
                  {Page.extras.interestsTitle}
                </h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {interests.map((interest: any) => (
                    <Badge
                      variant="outline"
                      key={interest}
                      className="text-md py-1 px-3"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="contact" 
          className="py-16 md:py-24 bg-subtle-gradient"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-2">
                {Page.contact.title}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-loose">
                {Page.contact.subtitle}
              </p>
            </div>
            <Contact contactFormData={contactFormData} />
          </div>
        </motion.section>
      </main>
      <Footer 
        footerData={footerData}
        data={data}
      />
      <ScrollToTop />
    </motion.div>
  );
}
