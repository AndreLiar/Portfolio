import { ReactNode } from "react";

// The root layout is simple, as most of the logic is in the [locale] layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
