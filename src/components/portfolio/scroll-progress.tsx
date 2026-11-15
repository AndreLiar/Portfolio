"use client";

import { m, useScroll, useSpring } from "framer-motion";

/**
 * A thin Google-blue reading-progress bar pinned to the very top of the page.
 * Functional (shows how far through the page you are) rather than decorative —
 * and it rides the real window scroll. Springed so it eases rather than jumps.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <m.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-primary"
    />
  );
}
