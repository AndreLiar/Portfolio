import type { Metadata } from 'next';
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
  children
}: {
  children: React.ReactNode;
}) {
  // This layout no longer defines the root HTML structure.
  // It only provides the dynamic metadata and renders the page content.
  // The RootLayout in src/app/layout.tsx handles the <html>, <body>, fonts, and Toaster.
  return <>{children}</>;
}
