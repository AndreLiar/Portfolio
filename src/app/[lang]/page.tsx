import { MainContent } from '@/components/portfolio/main-content';
import { getDictionary } from '@/lib/dictionaries';
import { ServerStructuredData } from '@/components/seo/server-structured-data';

export default async function Home({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app';
  
  return (
    <>
      <ServerStructuredData 
        data={dictionary.data} 
        locale={lang} 
        baseUrl={baseUrl}
      />
      <MainContent
        messages={dictionary}
      />
    </>
  );
}
