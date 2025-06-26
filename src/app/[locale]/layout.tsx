import type { ReactNode } from 'react';

// This layout is a fallback to prevent routing errors from the [locale] directory.
// It simply renders its children. All main layout logic is in /src/app/layout.tsx.
export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
