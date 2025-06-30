import { MainContent } from '@/components/portfolio/main-content';
import { getDictionary } from '@/lib/dictionaries';

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  
  return (
    <MainContent
      messages={dictionary}
    />
  );
}
