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

const PROJECT_ACCENTS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#0ea5e9"];

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
  accentIndex?: number;
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
  accentIndex = 0,
  ...details
}: ProjectCardProps) {
  const accent = PROJECT_ACCENTS[accentIndex % PROJECT_ACCENTS.length];
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

  const tagline = (details as any).oneLinePitch || purpose;
  // `role` is a full paragraph in the data — derive a short label for the eyebrow.
  const roleLabel = role.split(/[.—]/)[0].trim();
  const MAX_STACK = 7;
  const visibleStack = stack.slice(0, MAX_STACK);
  const extraStack = stack.length - visibleStack.length;

  return (
    <>
      <Card className="flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm group overflow-hidden relative">
        {/* Color accent stripe */}
        <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: accent }} />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(135deg, ${accent}12 0%, transparent 55%)` }} />

        <CardHeader className="relative z-10 pb-3">
          {/* Role eyebrow */}
          <span
            className="inline-flex items-center self-start max-w-full truncate rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider mb-3"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
            title={roleLabel}
          >
            {roleLabel}
          </span>
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="font-headline text-2xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1 flex-shrink-0"
                aria-label="View Live Project"
              >
                <PlayCircle className="w-5 h-5" />
              </a>
            )}
          </div>
          <CardDescription className="text-[15px] mt-2 line-clamp-3 leading-relaxed">{tagline}</CardDescription>
        </CardHeader>

        <CardContent className="flex-grow space-y-5 relative z-10 pt-1">
          {/* Impact — the single most important line, visually elevated */}
          <div className="rounded-lg border p-3" style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0d` }}>
            <h4 className="font-semibold mb-1 text-[11px] uppercase tracking-wider" style={{ color: accent }}>{t.impact}</h4>
            <p className="text-sm font-medium text-foreground leading-relaxed">{impact}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">{t.features}</h4>
            <ul className="space-y-1.5">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accent }} />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2.5 text-[11px] uppercase tracking-wider text-muted-foreground">{t.stack}</h4>
            <div className="flex flex-wrap gap-1.5">
              {visibleStack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-secondary/50 hover:bg-secondary hover:text-secondary-foreground transition-colors px-2.5 py-0.5 text-xs font-medium border border-transparent hover:border-border"
                >
                  {tech}
                </Badge>
              ))}
              {extraStack > 0 && (
                <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-medium text-muted-foreground border-border/60">
                  +{extraStack}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-5 border-t border-border/50 mt-auto relative z-10 bg-muted/10">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full text-white shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: accent }}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Case Study
          </Button>

          {(link || repoUrl) && (
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
          )}
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
