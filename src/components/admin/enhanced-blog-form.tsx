'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Edit } from 'lucide-react';
import { AIBlogGenerator } from './ai-blog-generator';
import { BlogPostForm } from './blog-post-form';
import type { Tag } from '@/lib/firebase/types';

interface EnhancedBlogFormProps {
  tags: Tag[];
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    status: string;
  };
}

export function EnhancedBlogForm({ tags, mode, initialData }: EnhancedBlogFormProps) {
  const [generatedData, setGeneratedData] = useState<{
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<string>(mode === 'create' ? 'ai-generate' : 'manual-edit');

  const handleAIGenerated = (data: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
  }) => {
    setGeneratedData(data);
    // Switch to manual edit tab after generation
    setActiveTab('manual-edit');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Generate
          </TabsTrigger>
          <TabsTrigger value="manual-edit" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Manual Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-generate" className="space-y-6">
          <AIBlogGenerator onGenerated={handleAIGenerated} />
          
          {generatedData && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle>Generated Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{generatedData.title}</h3>
                    <p className="text-muted-foreground mt-2">{generatedData.excerpt}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {generatedData.content.substring(0, 500)}...
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="manual-edit" className="space-y-6">
          <BlogPostForm
            tags={tags}
            mode={mode}
            post={generatedData ? {
              id: '',
              author_id: null,
              title: generatedData.title,
              slug: generatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              excerpt: generatedData.excerpt,
              content_md: generatedData.content,
              content_html: null,
              cover_url: null,
              status: 'draft' as const,
              published_at: null,
              created_at: new Date(),
              updated_at: new Date(),
              tags: generatedData.tags.map((tagName, index) => {
                const tag = tags.find(t => t.name === tagName);
                return tag || { 
                  id: `generated-${tagName}-${index}`, 
                  name: tagName, 
                  slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 
                  created_at: new Date(), 
                  post_count: 0 
                };
              })
            } : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}