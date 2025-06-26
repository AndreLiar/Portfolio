"use client";

import { useState } from "react";
import type { data } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";

type Project = (typeof data)["projects"][0];

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const [visibleCount, setVisibleCount] = useState(2);

  const showMoreProjects = () => {
    setVisibleCount(projects.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.slice(0, visibleCount).map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
      {visibleCount < projects.length && (
        <div className="text-center mt-12">
          <Button onClick={showMoreProjects} size="lg">
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
