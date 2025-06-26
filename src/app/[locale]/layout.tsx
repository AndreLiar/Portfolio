import { ReactNode } from "react";

// This layout exists to satisfy the Next.js router for an obsolete route.
// All content is rendered via src/app/layout.tsx.
export default function ObsoleteLocaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
