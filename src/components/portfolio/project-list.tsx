"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { ProjectListSkeleton } from "./project-skeleton";

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
  const [visibleCount, setVisibleCount] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const showMoreProjects = () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount(projects.length);
      setIsLoadingMore(false);
    }, 600);
  };

  if (isLoading) {
    return <ProjectListSkeleton count={2} />;
  }

  return (
    <>
      <motion.div 
        key={visibleCount}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.slice(0, visibleCount).map((project) => (
          <motion.div key={project.title} variants={itemVariants}>
            <ProjectCard {...project} projectCardData={projectCardData} />
          </motion.div>
        ))}
        
        {/* Show skeleton for loading more projects */}
        {isLoadingMore && visibleCount < projects.length && (
          [...Array(Math.min(projects.length - visibleCount, 2))].map((_, index) => (
            <motion.div key={`skeleton-${index}`} variants={itemVariants}>
              <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
                <div className="h-7 bg-muted rounded-md w-3/4 mb-4" />
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-4/5" />
                </div>
                <div className="flex gap-2 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 bg-muted rounded-full w-16" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
      
      {visibleCount < projects.length && (
        <div className="text-center mt-12">
          <Button 
            onClick={showMoreProjects} 
            size="lg"
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Loading...
              </>
            ) : (
              projectListData.loadMore
            )}
          </Button>
        </div>
      )}
    </>
  );
}
