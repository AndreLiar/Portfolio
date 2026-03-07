import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';

// This function generates metadata dynamically based on the language.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://andre-portfolio.vercel.app';

  return {
    title: dictionary.Metadata.title,
    description: dictionary.Metadata.description,
    keywords: [
      'Fullstack Developer',
      'Software Engineer',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'Cloud Computing',
      'Azure',
      'AI Integration',
      'Web Development',
      'Portfolio',
      'Andre Kanmegne'
    ],
    authors: [{ name: dictionary.data.fullName }],
    creator: dictionary.data.fullName,
    publisher: dictionary.data.fullName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang,
      url: `${baseUrl}/${lang}`,
      siteName: dictionary.Metadata.title,
      title: dictionary.Metadata.title,
      description: dictionary.Metadata.description,
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${dictionary.data.fullName} - ${dictionary.Metadata.description}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@YourTwitterHandle', // Update with actual handle
      creator: '@YourTwitterHandle', // Update with actual handle
      title: dictionary.Metadata.title,
      description: dictionary.Metadata.description,
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
      },
    },
    other: {
      'google-site-verification': 'your-google-site-verification-code', // Add actual verification code
    },
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
