import { MainContent } from '@/components/portfolio/main-content';
import { getDictionary } from '@/lib/dictionaries';
import { ServerStructuredData } from '@/components/seo/server-structured-data';
import { createSupabaseServer } from '@/lib/supabase/server';

async function getLatestBlogPosts() {
  try {
    const supabase = await createSupabaseServer();

    // Get latest published posts
    const { data: posts } = await supabase
      .from('posts_with_author')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3);

    if (!posts || posts.length === 0) {
      return { posts: [], postTags: {} };
    }

    // Get tags for all posts
    const postIds = posts.map(post => post.id);
    const { data: postTagsData } = await supabase
      .from('post_tags')
      .select(`
        post_id,
        tags (
          id,
          name,
          slug
        )
      `)
      .in('post_id', postIds);

    // Group tags by post ID
    const postTags: { [postId: string]: any[] } = {};
    postTagsData?.forEach((pt: any) => {
      if (!postTags[pt.post_id]) {
        postTags[pt.post_id] = [];
      }
      postTags[pt.post_id].push(pt.tags);
    });

    return { posts, postTags };
  } catch (error) {
    console.error('Error fetching latest blog posts:', error);
    return { posts: [], postTags: {} };
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app';
  
  // Fetch blog posts for the homepage
  const { posts: blogPosts, postTags: blogPostTags } = await getLatestBlogPosts();
  
  return (
    <>
      <ServerStructuredData 
        data={dictionary.data} 
        locale={lang} 
        baseUrl={baseUrl}
      />
      <MainContent
        messages={dictionary}
        lang={lang}
        blogPosts={blogPosts}
        blogPostTags={blogPostTags}
      />
    </>
  );
}
