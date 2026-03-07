"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, PlayCircle, BookOpen } from "lucide-react";
import { ProjectDetailsModal } from "./project-details-modal";

interface ProjectCardProps {
  title: string;
  purpose: string;
  stack: string[];
  impact: string;
  role: string;
  features: string[];
  link?: string;
  repoUrl?: string;
  projectCardData: any;
  // New detailed fields
  oneLinePitch?: string;
  whyItMatters?: string;
  differentiators?: string[];
  architecture?: string[];
  scope?: string[];
  acceptanceCriteria?: string[];
  testPlan?: string[];
  evals?: string[];
  atsKeywords?: string[];
  repoBlueprint?: string;
  interviewTalkingPoints?: string[];
}

export function ProjectCard({
  title,
  purpose,
  stack,
  impact,
  role,
  features,
  link,
  repoUrl,
  projectCardData: t,
  ...details
}: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullProjectData = {
    title,
    purpose,
    stack,
    impact,
    role,
    features,
    link,
    repoUrl,
    ...details
  };

  return (
    <>
      <Card className="flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <CardHeader className="relative z-10 pb-2">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="font-headline text-2xl font-bold group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="View Live Project"
              >
                <PlayCircle className="w-5 h-5" />
              </a>
            )}
          </div>
          <CardDescription className="text-base mt-2 line-clamp-2">{purpose}</CardDescription>
        </CardHeader>

        <CardContent className="flex-grow space-y-6 relative z-10 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1 text-xs uppercase tracking-wider text-muted-foreground">{t.role}</h4>
              <p className="text-sm font-medium">{role}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-xs uppercase tracking-wider text-muted-foreground">{t.impact}</h4>
              <p className="text-sm font-medium">{impact}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">{t.features}</h4>
            <ul className="space-y-1.5">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-xs text-muted-foreground italic pl-3.5">
                  +{features.length - 3} more features
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground">{t.stack}</h4>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-secondary/50 hover:bg-secondary hover:text-secondary-foreground transition-colors px-2.5 py-0.5 text-xs font-medium border border-transparent hover:border-border"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6 border-t border-border/50 mt-auto relative z-10 bg-muted/10">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50 shadow-sm"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Case Study
          </Button>

          <div className="flex w-full gap-3">
            {link && (
              <Button asChild variant="default" className="flex-1 bg-card hover:bg-accent text-foreground border border-border/50 shadow-sm">
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  {t.liveDemo}
                </a>
              </Button>
            )}
            {repoUrl && (
              <Button variant="outline" asChild className="flex-1 border-border/50 hover:bg-accent hover:text-accent-foreground">
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t.github}
                </a>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <ProjectDetailsModal
        project={fullProjectData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
