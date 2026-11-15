
import type { Metadata, Viewport } from 'next';
import { Figtree, Roboto } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Google-style type pairing: Figtree (display — the closest free stand-in for
// Product Sans/Google Sans) + Roboto (body/UI — Google's own typeface).
const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

// Static metadata for the root. Dynamic metadata will be added by child layouts.
export const metadata: Metadata = {
  title: "André Kanmegne Portfolio",
  description: "Portfolio of André Kanmegne, Software Engineer — AI & Platform Engineering.",
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
      className={`${figtree.variable} ${roboto.variable}`}
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
