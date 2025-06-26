import {
  Briefcase,
  GraduationCap,
  Heart,
  Code,
  Cloud,
  Database,
  BrainCircuit,
  BotMessageSquare,
  Type,
} from 'lucide-react';

import { Header } from '@/components/portfolio/header';
import { Hero } from '@/components/portfolio/hero';
import { SkillCard } from '@/components/portfolio/skill-card';
import { TimelineItem } from '@/components/portfolio/timeline-item';
import { RecommendationCard } from '@/components/portfolio/recommendation-card';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { Badge } from '@/components/ui/badge';
import { ProjectList } from '@/components/portfolio/project-list';
import messages from '../../messages/en.json';

const iconMap: { [key: string]: React.ElementType } = {
  Code,
  Cloud,
  Database,
  BrainCircuit,
  BotMessageSquare,
  Type,
};

export default function Home() {
  const { data, Page, Header: headerData, Hero: heroData, ProjectList: projectListData, ProjectCard: projectCardData, ContactForm: contactFormData, Footer: footerData } = messages;
  
  const skills = data.skills.map((skill: any) => ({
    ...skill,
    Icon: iconMap[skill.Icon],
  }));

  const workExperience = data.workExperience;
  const education = data.education;
  const projects = data.projects;
  const recommendations = data.recommendations;
  const languages = data.languages;
  const interests = data.interests;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        headerData={headerData}
        name={data.name}
        resumeUrl={data.resumeUrl}
      />
      <main className="flex-1">
        <Hero
          heroData={heroData}
          data={data}
        />

        <section id="projects" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              {Page.projects.title}
            </h2>
            <ProjectList 
              projects={projects}
              projectListData={projectListData}
              projectCardData={projectCardData}
            />
          </div>
        </section>

        <section id="skills" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              {Page.skills.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skillCategory: any, index: number) => (
                <SkillCard key={index} {...skillCategory} />
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              {Page.journey.title}
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>

              <h3 className="text-2xl font-headline font-semibold text-center my-8 flex items-center justify-center gap-2">
                <Briefcase className="w-6 h-6" />{' '}
                {Page.journey.workExperienceTitle}
              </h3>
              {workExperience.map((item: any, index: number) => (
                <TimelineItem key={index} {...item} />
              ))}

              <h3 className="text-2xl font-headline font-semibold text-center mt-16 mb-8 flex items-center justify-center gap-2">
                <GraduationCap className="w-6 h-6" /> {Page.journey.educationTitle}
              </h3>
              {education.map((item: any, index: number) => (
                <TimelineItem key={index} {...item} icon={GraduationCap} />
              ))}
            </div>
          </div>
        </section>

        <section id="recommendations" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              {Page.recommendations.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {recommendations.map((rec: any, index: number) => (
                <RecommendationCard key={index} {...rec} />
              ))}
            </div>
          </div>
        </section>

        <section id="extras" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 text-center">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-headline font-semibold mb-4">
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
                  <Heart className="w-6 h-6 text-accent" />{' '}
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
        </section>

        <section id="contact" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">
                {Page.contact.title}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {Page.contact.subtitle}
              </p>
            </div>
            <Contact contactFormData={contactFormData} />
          </div>
        </section>
      </main>
      <Footer 
        footerData={footerData}
        data={data}
      />
    </div>
  );
}
