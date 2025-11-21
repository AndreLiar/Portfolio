import { MainContent } from '@/components/portfolio/main-content';
import { getDictionary } from '@/lib/dictionaries';
import { ServerStructuredData } from '@/components/seo/server-structured-data';
import { PortfolioDataService, formatPortfolioDataForComponents } from '@/lib/portfolio-data';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app';
  
  // Fetch portfolio data from Firestore
  const portfolioData = await PortfolioDataService.getPortfolioData();
  const formattedData = formatPortfolioDataForComponents(portfolioData);
  
  // Merge Firestore data with dictionary (override data section)
  const mergedDictionary = {
    ...dictionary,
    data: formattedData.bio ? {
      ...formattedData.bio,
      skills: formattedData.skills,
      projects: formattedData.projects,
      workExperience: formattedData.workExperience,
      education: formattedData.education,
      softSkills: formattedData.softSkills,
      languages: formattedData.languages,
      interests: formattedData.interests,
    } : dictionary.data // Fallback to dictionary data if no bio data
  };
  
  return (
    <>
      <ServerStructuredData 
        data={mergedDictionary.data} 
        locale={lang} 
        baseUrl={baseUrl}
      />
      <MainContent
        messages={mergedDictionary}
        lang={lang}
        blogPosts={[]}
        blogPostTags={{}}
      />
    </>
  );
}