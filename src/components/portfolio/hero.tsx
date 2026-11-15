"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// The section stays painted (opacity 1) on first render — it only orchestrates
// the stagger for its children. Fading the whole section would hide the LCP
// element (the hero heading) until hydration and tank Largest Contentful Paint.
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

// Material "emphasized" entrance — short travel, standard-decelerate easing.
const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
  },
};

export function Hero({ heroData, lang = "en" }: { heroData: any; lang?: string }) {
  return (
    <motion.section
      id="hero"
      className="relative overflow-hidden bg-background flex items-center min-h-[88vh] py-20 md:py-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Clean Google-style canvas: white with one soft, low-contrast blue glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-muted to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — text (60%) */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            {/* Name — LCP element. Plain <h1> (no motion) so it paints at FCP. */}
            <h1 className="mb-4 font-headline text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              {heroData.name}
            </h1>

            {/* Role — the one blue accent on the highlighted phrase. */}
            <h2 className="mb-6 text-2xl font-normal leading-snug text-muted-foreground md:text-3xl">
              {heroData.title}{" "}
              <span className="font-medium text-primary">{heroData.titleHighlight}</span>
            </h2>

            {/* Location — Material chip */}
            <motion.div variants={itemVariants} className="mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-e1">
                <MapPin className="h-4 w-4 text-primary" />
                {heroData.location}
              </span>
            </motion.div>

            {/* Description — static (LCP-adjacent, paints at FCP). */}
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-foreground md:text-xl lg:mx-0">
              {heroData.description1}
            </p>

            {/* Metrics — Material cards (elevated, blue figures) */}
            <motion.div
              variants={itemVariants}
              className="mx-auto mb-10 grid max-w-md grid-cols-3 gap-3 lg:mx-0 sm:gap-4"
            >
              {[
                { value: "3", label: heroData.metrics?.years ?? "Years of experience" },
                { value: "10+", label: heroData.metrics?.projects ?? "Projects shipped" },
                { value: "6", label: heroData.metrics?.domains ?? "Engineering domains" },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-e1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-e2 lg:text-left"
                >
                  <p className="text-3xl font-semibold leading-none text-primary">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-xs font-medium leading-tight text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTAs — Material pill buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
            >
              <Button
                size="lg"
                asChild
                className="h-12 w-full rounded-pill bg-primary px-8 text-base font-medium text-primary-foreground shadow-e1 transition-all hover:bg-primary hover:shadow-e2 active:scale-[0.98] sm:w-auto"
              >
                <a href="#projects">{heroData.buttons.viewProjects}</a>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="h-12 w-full rounded-pill border border-border bg-card px-8 text-base font-medium text-primary transition-all hover:bg-accent hover:text-accent-foreground active:scale-[0.98] sm:w-auto"
              >
                <a href="#contact">{heroData.contactMe}</a>
              </Button>
            </motion.div>

            {/* Tagline */}
            <motion.div variants={itemVariants} className="mt-8">
              <p className="text-sm text-muted-foreground md:text-base">{heroData.tagline}</p>
            </motion.div>
          </div>

          {/* RIGHT — the FULL portrait (40%), framed in the one Google 4-colour
              signature (now a slowly-flowing living gradient). Container aspect
              matches the image (640×959 ≈ 2:3) so object-cover fills it with zero
              cropping — the whole photo shows. */}
          <motion.div
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div
              className="animated-gradient-frame w-full max-w-[17rem] shadow-e2 sm:max-w-xs lg:max-w-md"
              style={{
                borderRadius: "1.75rem",
                padding: "5px",
              }}
            >
              <div
                className="relative w-full overflow-hidden bg-background"
                style={{ aspectRatio: "640 / 959", borderRadius: "1.5rem" }}
              >
                <Image
                  src="/images/andre-kanmegne.jpg"
                  alt={heroData.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 16rem"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
