"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";

type Project = {
  title: string;
  purpose: string;
  stack: string[];
  impact: string;
  role: string;
  features: string[];
  link?: string;
  repoUrl?: string;
}

interface ProjectListProps {
  projects: Project[];
  labels: {
    loadMore: string;
  };
  projectCardLabels: any;
}

export function ProjectList({ projects, labels, projectCardLabels }: ProjectListProps) {
  const [visibleCount, setVisibleCount] = useState(2);

  const showMoreProjects = () => {
    setVisibleCount(projects.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.slice(0, visibleCount).map((project, index) => (
          <ProjectCard key={index} {...project} labels={projectCardLabels} />
        ))}
      </div>
      {visibleCount < projects.length && (
        <div className="text-center mt-12">
          <Button onClick={showMoreProjects} size="lg">
            {labels.loadMore}
          </Button>
        </div>
      )}
    </>
  );
}
