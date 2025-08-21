"use client";

import { motion } from "framer-motion";

const shimmerVariants = {
  initial: {
    backgroundPosition: "-200% 0"
  },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export function ProjectCardSkeleton() {
  return (
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className="bg-card rounded-xl border border-border p-6 space-y-4 overflow-hidden relative"
      style={{
        background: "linear-gradient(90deg, hsl(var(--card)) 25%, hsl(var(--muted)) 50%, hsl(var(--card)) 75%)",
        backgroundSize: "200% 100%"
      }}
    >
      {/* Title skeleton */}
      <div className="h-7 bg-muted rounded-md w-3/4" />
      
      {/* Purpose skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-4/5" />
      </div>

      {/* Tech stack skeleton */}
      <div className="flex flex-wrap gap-2 pt-2">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="h-6 bg-muted rounded-full"
            style={{ width: `${60 + Math.random() * 40}px` }}
          />
        ))}
      </div>

      {/* Role and Impact skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
      </div>

      {/* Features skeleton */}
      <div className="space-y-3 pt-4">
        <div className="h-5 bg-muted rounded w-20" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="h-4 w-4 bg-muted rounded-full mt-0.5 flex-shrink-0" />
              <div className="h-4 bg-muted rounded flex-1" style={{ width: `${70 + Math.random() * 30}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex gap-3 pt-6">
        <div className="h-10 bg-muted rounded-md w-24" />
        <div className="h-10 bg-muted rounded-md w-20" />
      </div>
    </motion.div>
  );
}

export function ProjectListSkeleton({ count = 2 }: { count?: number }) {
  const staggerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
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

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      variants={staggerVariants}
      initial="hidden"
      animate="visible"
    >
      {[...Array(count)].map((_, index) => (
        <motion.div key={index} variants={itemVariants}>
          <ProjectCardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
}