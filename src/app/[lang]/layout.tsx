import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';

// This function generates metadata dynamically based on the language.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://devandre.sbs';

  return {
    metadataBase: new URL(baseUrl),
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
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // RootLayout (src/app/layout.tsx) owns <html>/<body>/fonts/Toaster.
  // Here we inject Schema.org JSON-LD (Person + WebSite) so search engines
  // attribute the content, skills and social profiles to Andre on devandre.sbs.
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://devandre.sbs';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: dict.data.fullName,
        url: baseUrl,
        jobTitle: dict.data.title,
        sameAs: [dict.data?.contact?.github, dict.data?.contact?.linkedin].filter(Boolean),
        knowsAbout: [
          'Software Engineering',
          'AI Engineering',
          'LLMOps',
          'Retrieval-Augmented Generation',
          'Kubernetes',
          'GitOps',
          'Platform Engineering',
          'Cloud',
        ],
      },
      {
        '@type': 'WebSite',
        name: dict.Metadata?.title ?? dict.data.fullName,
        url: baseUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
