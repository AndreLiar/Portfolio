
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Static metadata for the root. Dynamic metadata will be added by child layouts.
export const metadata: Metadata = {
  title: "Laurel Kanmegne Portfolio",
  description: "Portfolio of Laurel Kanmegne, Fullstack Software Engineer.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
