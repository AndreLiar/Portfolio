"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

// Public Cal.com booking link. If you rename your Cal.com username or event,
// update this one constant. The event's Location should be set to Google Meet
// so each booking auto-generates a Meet link.
const CAL_LINK = "andre-kanmegne-gabwna/30min";
const CAL_NAMESPACE = "book-call";

export function BookCall({ contactEmail }: { contactEmail?: string }) {
  useEffect(() => {
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
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
        <Cal
          namespace={CAL_NAMESPACE}
          calLink={CAL_LINK}
          style={{ width: "100%", height: "100%", minHeight: "640px", overflow: "scroll" }}
          config={{ layout: "month_view" }}
        />
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
