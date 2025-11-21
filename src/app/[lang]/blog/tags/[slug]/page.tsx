import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import { TagsService } from '@/lib/firebase/firestore';

interface TagPageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getTag(slug: string) {
  try {
    const tags = await TagsService.getTags();
    return tags.find(tag => tag.slug === slug);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);
  
  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `Posts tagged "${tag.name}"`,
    description: `All blog posts tagged with ${tag.name}`,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { lang, slug } = await params;
  const { page } = await searchParams;
  const tag = await getTag(slug);

  if (!tag) {
    notFound();
  }

  // Redirect to blog page with tag filter
  const searchParamsString = new URLSearchParams({
    tag: slug,
    ...(page && { page }),
  }).toString();

  redirect(`/${lang}/blog?${searchParamsString}`);
}