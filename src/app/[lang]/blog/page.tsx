import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getDictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
  return {
    title: `Blog | ${dictionary.Metadata.title}`,
    description: 'Read the latest articles and insights from Laurel Kanmegne',
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${lang}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Thoughts, insights, and learnings from my journey as a software engineer
          </p>
        </div>

        {/* Coming Soon Content */}
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-primary opacity-50" />
            <h2 className="text-2xl font-semibold mb-4">Blog Coming Soon</h2>
            <p className="text-muted-foreground mb-8">
              I'm working on creating valuable content about software engineering, 
              technology insights, and my development journey. Stay tuned!
            </p>
            <Card className="p-6 bg-muted/50">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Technical tutorials and best practices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Project deep-dives and case studies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Industry insights and trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Developer tools and productivity tips</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}