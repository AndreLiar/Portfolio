"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
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

// Number of cards shown before the visitor clicks "See more".
const INITIAL_VISIBLE = 4;

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  hidden: {},
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
  const [showAll, setShowAll] = useState(false);
  const hasMore = projects.length > INITIAL_VISIBLE;
  const remaining = projects.length - INITIAL_VISIBLE;

  // Every project is always rendered into the DOM (so all case studies stay in
  // the server HTML and remain crawlable); the extras beyond INITIAL_VISIBLE are
  // only visually hidden until "See more" is clicked — we never drop them from
  // the markup the way the old skeleton + Load-More version did.
  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {projects.map((project, index) => {
          const isHidden = !showAll && index >= INITIAL_VISIBLE;
          return (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className={isHidden ? "hidden" : undefined}
              aria-hidden={isHidden}
            >
              <ProjectCard {...project} projectCardData={projectCardData} accentIndex={index} />
            </motion.div>
          );
        })}
      </motion.div>

      {hasMore && (
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="border-2 border-primary/40 text-primary hover:bg-primary/5 hover:border-primary font-semibold px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            {showAll ? (
              <>
                {projectListData?.seeLess ?? "See less"}
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                {(projectListData?.seeMore ?? "See more projects")}
                <span className="ml-1 opacity-70">({remaining})</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
