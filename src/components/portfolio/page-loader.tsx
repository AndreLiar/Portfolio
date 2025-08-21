"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageLoaderProps {
  onComplete?: () => void;
  name?: string;
}

export function PageLoader({ onComplete, name = "LK" }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }, 2000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const logoVariants = {
    hidden: { 
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${Math.min(progress, 100)}%`,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const particleVariants = {
    animate: {
      y: [-20, -40, -20],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background to-card"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                variants={particleVariants}
                animate="animate"
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>

          <div className="text-center space-y-8">
            {/* Logo/Initials */}
            <motion.div
              variants={logoVariants}
              className="relative"
            >
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl">
                <span className="text-2xl font-headline font-bold text-primary-foreground">
                  {name}
                </span>
              </div>
              
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 w-24 h-24 mx-auto border-2 border-primary/30 border-t-primary rounded-full"
              />
            </motion.div>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-headline font-semibold text-muted-foreground">
                Loading Portfolio...
              </h2>
              
              {/* Progress bar */}
              <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto">
                <motion.div
                  variants={progressVariants}
                  animate="visible"
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
              
              {/* Progress percentage */}
              <motion.p 
                className="text-sm text-muted-foreground tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {Math.min(Math.round(progress), 100)}%
              </motion.p>
            </motion.div>
          </div>

          {/* Subtle grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}