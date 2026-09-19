
import type { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Static metadata for the root. Dynamic metadata will be added by child layouts.
export const metadata: Metadata = {
  title: "Andre Kanmegne Portfolio",
  description: "Portfolio of Andre Kanmegne, Software Engineer — AI & Platform Engineering.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
