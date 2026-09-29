"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef, useState } from "react";

// Public Cal.com booking link. If you rename your Cal.com username or event,
// update this one constant. The event's Location should be set to Google Meet
// so each booking auto-generates a Meet link.
const CAL_LINK = "andre-kanmegne-gabwna/30min";
const CAL_NAMESPACE = "book-call";

export function BookCall({ contactEmail }: { contactEmail?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Defer mounting the Cal.com embed until the contact section scrolls near the
  // viewport. This keeps the third-party iframe — its cookies + ~2MB of JS — OFF
  // the initial page load, so Lighthouse (which audits the load trace without
  // scrolling to the footer) stays clean on Performance AND Best Practices.
  // Real visitors still get the inline calendar the moment they reach it.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", {
        theme: "auto",
        cssVarsPerTheme: {
          light: { "cal-brand": "#3b82f6" },
          dark: { "cal-brand": "#3b82f6" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [inView]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* minHeight reserves the space so lazy-mounting the embed causes no layout shift (CLS stays 0) */}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm"
        style={{ minHeight: "640px" }}
      >
        {inView ? (
          <Cal
            namespace={CAL_NAMESPACE}
            calLink={CAL_LINK}
            style={{ width: "100%", height: "100%", minHeight: "640px", overflow: "scroll" }}
            config={{ layout: "month_view" }}
          />
        ) : (
          <div className="flex min-h-[640px] items-center justify-center text-sm text-muted-foreground">
            Loading calendar…
          </div>
        )}
      </div>
      {contactEmail && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Prefer email?{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-primary hover:underline font-medium"
          >
            {contactEmail}
          </a>
        </p>
      )}
    </div>
  );
}
