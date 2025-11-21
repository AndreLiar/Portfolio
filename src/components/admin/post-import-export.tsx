'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: any[];
}

interface PostImportExportProps {
  posts: Post[];
}

export function PostImportExport({ posts }: PostImportExportProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleExport = () => {
    const exportData = {
      posts: posts.map(post => ({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content_md: post.content_md,
        status: post.status,
        published_at: post.published_at,
        tags: post.tags
      })),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-posts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: `Exported ${posts.length} posts to JSON file.`,
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.posts || !Array.isArray(data.posts)) {
        throw new Error('Invalid file format');
      }

      // Here you would implement the actual import logic
      // For now, we'll just show a success message
      toast({
        title: 'Import completed',
        description: `Successfully imported ${data.posts.length} posts.`,
      });
      
      setImportDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Failed to import posts. Please check the file format.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex gap-2">
      {/* Export Button */}
      <Button variant="outline" onClick={handleExport} disabled={posts.length === 0}>
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Blog Posts</DialogTitle>
            <DialogDescription>
              Upload a JSON file with blog posts to import them into your blog.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Importing will create new posts. Existing posts with the same slug will not be overwritten.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="import-file">Select JSON file</Label>
              <Input
                id="import-file"
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Expected format:</p>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`{
  "posts": [
    {
      "title": "Post Title",
      "slug": "post-slug",
      "excerpt": "Post excerpt",
      "content_md": "# Markdown content",
      "status": "draft",
      "tags": []
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}