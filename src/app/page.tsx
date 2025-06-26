import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Heart,
} from "lucide-react";

import { data } from "@/lib/data";
import { Header } from "@/components/portfolio/header";
import { Hero } from "@/components/portfolio/hero";
import { ProjectCard } from "@/components/portfolio/project-card";
import { SkillCard } from "@/components/portfolio/skill-card";
import { TimelineItem } from "@/components/portfolio/timeline-item";
import { RecommendationCard } from "@/components/portfolio/recommendation-card";
import { ResumeAnalyzer } from "@/components/portfolio/resume-analyzer";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />

        <section id="projects" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Project Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Core Technical Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.skills.map((skillCategory, index) => (
                <SkillCard key={index} {...skillCategory} />
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              My Journey
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>
              
              <h3 className="text-2xl font-headline font-semibold text-center my-8 flex items-center justify-center gap-2">
                <Briefcase className="w-6 h-6" /> Work Experience
              </h3>
              {data.workExperience.map((item, index) => (
                <TimelineItem key={index} {...item} />
              ))}

              <h3 className="text-2xl font-headline font-semibold text-center mt-16 mb-8 flex items-center justify-center gap-2">
                <GraduationCap className="w-6 h-6" /> Education
              </h3>
              {data.education.map((item, index) => (
                <TimelineItem key={index} {...item} icon={GraduationCap} />
              ))}
            </div>
          </div>
        </section>

        <section id="recommendations" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {data.recommendations.map((rec, index) => (
                <RecommendationCard key={index} {...rec} />
              ))}
            </div>
          </div>
        </section>

        <section id="analyzer" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">
                AI-Powered Resume Analyzer
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Test my AI skills. Paste your resume text below and get instant feedback on content, structure, and keyword optimization.
              </p>
            </div>
            <ResumeAnalyzer />
          </div>
        </section>

        <section id="extras" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 text-center">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-headline font-semibold mb-4">Languages</h3>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {data.languages.map(lang => <Badge variant="secondary" key={lang.name} className="text-lg py-1 px-3">{lang.name} ({lang.level})</Badge>)}
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-headline font-semibold mb-4 flex items-center justify-center gap-2">
                        <Heart className="w-6 h-6 text-accent" /> Interests
                    </h3>
                     <div className="flex justify-center gap-2 flex-wrap">
                        {data.interests.map(interest => <Badge variant="outline" key={interest} className="text-md py-1 px-3">{interest}</Badge>)}
                    </div>
                </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 md:py-24">
           <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">
                  Get In Touch
                 </h2>
                 <p className="text-muted-foreground max-w-xl mx-auto">
                   Have a project in mind, or just want to say hi? Feel free to reach out.
                 </p>
              </div>
              <Contact />
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
