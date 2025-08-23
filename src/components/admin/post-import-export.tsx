'use client';

import { useState } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
  tags?: string[];
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export function PostImportExport({ posts }: { posts: Post[] }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  // Export posts to JSON
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Prepare export data
      const exportData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        posts: posts.map(post => ({
          ...post,
          // Remove internal IDs and timestamps that shouldn't be imported
          id: undefined,
          created_at: undefined,
          updated_at: undefined,
        })),
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `blog-posts-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({ title: 'Success', description: `Exported ${posts.length} posts successfully` });
    } catch (error) {
      console.error('Export failed:', error);
      toast({ title: 'Error', description: 'Failed to export posts', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  // Import posts from JSON
  const handleImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      const fileContent = await importFile.text();
      const importData = JSON.parse(fileContent);

      if (!importData.posts || !Array.isArray(importData.posts)) {
        throw new Error('Invalid file format. Expected JSON with posts array.');
      }

      const posts = importData.posts;
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      // Import posts one by one
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        setImportProgress(((i + 1) / posts.length) * 100);

        try {
          // Validate required fields
          if (!post.title || !post.content_md) {
            throw new Error(`Post ${i + 1}: Missing required fields (title or content)`);
          }

          // Create FormData for the import
          const formData = new FormData();
          formData.append('title', post.title);
          formData.append('slug', post.slug || '');
          formData.append('excerpt', post.excerpt || '');
          formData.append('content_md', post.content_md);
          formData.append('cover_url', post.cover_url || '');
          formData.append('tags', Array.isArray(post.tags) ? post.tags.join(', ') : '');
          formData.append('status', post.status === 'published' ? 'draft' : post.status || 'draft'); // Import as drafts for safety

          // Call the create post action
          const response = await fetch('/admin/blog/import', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
          }

          success++;
        } catch (error) {
          failed++;
          errors.push(`Post "${post.title || 'Untitled'}": ${error}`);
          console.error(`Import error for post ${i + 1}:`, error);
        }
      }

      setImportResult({ success, failed, errors });
      
      if (success > 0) {
        toast({ title: 'Success', description: `Successfully imported ${success} posts` });
        // Refresh the page to show new posts
        setTimeout(() => window.location.reload(), 2000);
      }
      
      if (failed > 0) {
        toast({ title: 'Error', description: `Failed to import ${failed} posts`, variant: 'destructive' });
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({ title: 'Error', description: 'Failed to import posts: ' + (error as Error).message, variant: 'destructive' });
      setImportResult({ success: 0, failed: 0, errors: [(error as Error).message] });
    } finally {
      setIsImporting(false);
      setImportFile(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        toast({ title: 'Error', description: 'Please select a JSON file', variant: 'destructive' });
        return;
      }
      setImportFile(file);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Export Button */}
      <Button
        variant="outline"
        onClick={handleExport}
        disabled={isExporting || posts.length === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Exporting...' : `Export Posts (${posts.length})`}
      </Button>

      {/* Import Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Posts
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Blog Posts</DialogTitle>
            <DialogDescription>
              Upload a JSON file containing blog posts to import. Posts will be imported as drafts for review.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-file">Select JSON File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                disabled={isImporting}
              />
            </div>

            {importFile && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">{importFile.name}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(importFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            )}

            {isImporting && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Upload className="w-4 h-4" />
                  Importing posts...
                </div>
                <Progress value={importProgress} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  {Math.round(importProgress)}% complete
                </div>
              </div>
            )}

            {importResult && (
              <div className="space-y-2">
                {importResult.success > 0 && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Successfully imported {importResult.success} posts
                    </AlertDescription>
                  </Alert>
                )}

                {importResult.failed > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to import {importResult.failed} posts
                      {importResult.errors.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm font-medium">
                            View errors
                          </summary>
                          <ul className="mt-1 text-xs space-y-1">
                            {importResult.errors.slice(0, 5).map((error, i) => (
                              <li key={i} className="text-red-700">
                                {error}
                              </li>
                            ))}
                            {importResult.errors.length > 5 && (
                              <li className="text-red-600">
                                ...and {importResult.errors.length - 5} more errors
                              </li>
                            )}
                          </ul>
                        </details>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleImport}
              disabled={!importFile || isImporting}
              className="w-full"
            >
              {isImporting ? 'Importing...' : 'Import Posts'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}