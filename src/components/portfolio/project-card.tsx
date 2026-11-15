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

  const tagline = (details as any).oneLinePitch || purpose;
  // `role` is a full paragraph in the data — derive a short label for the eyebrow.
  const roleLabel = role.split(/[.—]/)[0].trim();
  const MAX_STACK = 7;
  const visibleStack = stack.slice(0, MAX_STACK);
  const extraStack = stack.length - visibleStack.length;

  return (
    <>
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-e1 transition-shadow duration-200 hover:shadow-e2">
        <CardHeader className="pb-3">
          {/* Role — Material chip, sentence case, single blue accent */}
          <span
            className="mb-3 inline-flex max-w-full items-center self-start truncate rounded-pill bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
            title={roleLabel}
          >
            {roleLabel}
          </span>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="font-headline text-2xl font-semibold leading-tight transition-colors duration-200 group-hover:text-primary">{title}</CardTitle>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-1 text-muted-foreground transition-colors hover:text-primary"
                aria-label="View Live Project"
              >
                <PlayCircle className="h-5 w-5" />
              </a>
            )}
          </div>
          <CardDescription className="mt-2 line-clamp-3 text-[15px] leading-relaxed">{tagline}</CardDescription>
        </CardHeader>

        <CardContent className="flex-grow space-y-5 pt-1">
          {/* Impact — the single most important line, elevated with a blue tint */}
          <div className="rounded-xl border border-primary/15 bg-accent p-3">
            <h4 className="mb-1 text-xs font-semibold text-primary">{t.impact}</h4>
            <p className="text-sm font-medium leading-relaxed text-foreground">{impact}</p>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold text-muted-foreground">{t.features}</h4>
            <ul className="space-y-1.5">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2.5 text-xs font-semibold text-muted-foreground">{t.stack}</h4>
            <div className="flex flex-wrap gap-1.5">
              {visibleStack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="rounded-pill bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {tech}
                </Badge>
              ))}
              {extraStack > 0 && (
                <Badge variant="outline" className="rounded-pill border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  +{extraStack}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-auto flex flex-col gap-3 border-t border-border bg-muted/40 pt-5">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-pill bg-primary text-primary-foreground shadow-e1 transition-shadow hover:bg-primary hover:shadow-e2"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Case Study
          </Button>

          {(link || repoUrl) && (
            <div className="flex w-full gap-3">
              {link && (
                <Button asChild variant="ghost" className="flex-1 rounded-pill border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {t.liveDemo}
                  </a>
                </Button>
              )}
              {repoUrl && (
                <Button variant="outline" asChild className="flex-1 rounded-pill border-border hover:bg-accent hover:text-accent-foreground">
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
