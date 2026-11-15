"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICON_VARIANTS } from "@/lib/icon-constants";

// Robust against this page's scroll quirks (dynamic section heights + a tall
// Cal.com embed can make a programmatic scrollTop jump): read the position from
// every candidate scroller, and scroll to top instantly via several fallbacks.
function getScrollY() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(getScrollY() > 240);

    // Check on mount
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    document.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      document.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    // Force an instant scroll (the global `scroll-behavior: smooth` + dynamic
    // heights make a smooth scrollTo unreliable here), targeting both roots, and
    // repeat next frame in case a layout shift re-scrolls us.
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    const toTop = () => {
      window.scrollTo(0, 0);
      html.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    toTop();
    requestAnimationFrame(() => {
      toTop();
      html.style.scrollBehavior = prev;
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-12 w-12 rounded-full shadow-e3 transition-shadow duration-200 bg-primary hover:bg-primary hover:shadow-e2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Scroll to top of page"
            title="Back to top"
            tabIndex={0}
          >
            <ArrowUp className={ICON_VARIANTS.button} aria-hidden="true" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}