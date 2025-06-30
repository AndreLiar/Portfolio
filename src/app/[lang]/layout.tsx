import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import { getDictionary } from '@/lib/dictionaries';

// This function generates metadata dynamically based on the language.
export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.Metadata.title,
    description: dictionary.Metadata.description,
  }
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang} className="dark" suppressHydrationWarning>
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
