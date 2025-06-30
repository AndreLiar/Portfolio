"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  projectListData: any;
  projectCardData: any;
}

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
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

export function ProjectList({ projects, projectListData, projectCardData }: ProjectListProps) {
  const [visibleCount, setVisibleCount] = useState(2);

  const showMoreProjects = () => {
    setVisibleCount(projects.length);
  };

  return (
    <>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={listVariants}
      >
        {projects.slice(0, visibleCount).map((project, index) => (
          <motion.div key={index} variants={itemVariants}>
            <ProjectCard {...project} projectCardData={projectCardData} />
          </motion.div>
        ))}
      </motion.div>
      {visibleCount < projects.length && (
        <div className="text-center mt-12">
          <Button onClick={showMoreProjects} size="lg">
            {projectListData.loadMore}
          </Button>
        </div>
      )}
    </>
  );
}
