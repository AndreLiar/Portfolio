import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { EditPostForm } from './edit-post-form';
import type { Post, Tag } from '@/lib/supabase/types';

interface EditPostPageProps {
  params: { id: string };
}

async function getPostForEdit(id: string): Promise<{
  post: Post | null;
  tags: Tag[];
}> {
  const supabase = await createSupabaseServer();

  // Get the post
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    return { post: null, tags: [] };
  }

  // Get post tags
  const { data: postTags } = await supabase
    .from('post_tags')
    .select(`
      tags (
        id,
        name,
        slug
      )
    `)
    .eq('post_id', post.id);

  const tags = postTags?.map(pt => (pt as any).tags).filter(Boolean) || [];

  return { post, tags };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPostContent postId={id} />
    </Suspense>
  );
}

async function EditPostContent({ postId }: { postId: string }) {
  const { post, tags } = await getPostForEdit(postId);

  if (!post) {
    notFound();
  }

  return <EditPostForm post={post} tags={tags} />;
}