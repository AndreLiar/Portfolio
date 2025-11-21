'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Github, Sparkles, RefreshCw, ExternalLink, Star, GitFork, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Repository } from '@/lib/github';

interface AIBlogGeneratorProps {
  onGenerated: (blogData: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
  }) => void;
}

export function AIBlogGenerator({ onGenerated }: AIBlogGeneratorProps) {
  const [githubUsername, setGithubUsername] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [tone, setTone] = useState<string>('professional');
  const [focus, setFocus] = useState<string>('overview');
  const [targetAudience, setTargetAudience] = useState<string>('developers');
  
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch repositories when username changes
  const fetchRepositories = async () => {
    if (!githubUsername.trim()) {
      setRepositories([]);
      return;
    }

    setIsLoadingRepos(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/generate-blog?username=${encodeURIComponent(githubUsername)}`);
      const result = await response.json();

      if (result.success) {
        setRepositories(result.data);
        if (result.data.length === 0) {
          setError('No repositories found for this user');
        }
      } else {
        setError(result.error || 'Failed to fetch repositories');
        setRepositories([]);
      }
    } catch (err) {
      setError('Network error while fetching repositories');
      setRepositories([]);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  // Generate blog post
  const generateBlogPost = async () => {
    if (!selectedRepo) {
      toast({
        title: 'Error',
        description: 'Please select a repository first',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubUsername,
          repositoryName: selectedRepo.name,
          tone,
          focus,
          targetAudience,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const blogData = result.data;
        
        // Pass generated data to parent component
        onGenerated({
          title: blogData.title,
          content: blogData.content,
          excerpt: blogData.excerpt,
          tags: blogData.tags,
        });

        toast({
          title: 'Success!',
          description: 'Blog post generated successfully',
        });
      } else {
        setError(result.error || 'Failed to generate blog post');
        toast({
          title: 'Error',
          description: result.error || 'Failed to generate blog post',
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'Network error while generating blog post';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Blog Post Generator
        </CardTitle>
        <CardDescription>
          Generate engaging blog posts from your GitHub projects using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GitHub Username Input */}
        <div className="space-y-2">
          <Label htmlFor="github-username">GitHub Username</Label>
          <div className="flex gap-2">
            <Input
              id="github-username"
              placeholder="Enter GitHub username..."
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRepositories()}
            />
            <Button
              onClick={fetchRepositories}
              disabled={isLoadingRepos || !githubUsername.trim()}
              variant="outline"
            >
              {isLoadingRepos ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Repository Selection */}
        {repositories.length > 0 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Select Repository ({repositories.length} found)</Label>
                {selectedRepo && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Selected: {selectedRepo.name}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Click on a repository card below to select it for AI blog post generation
              </p>
            </div>
            <div className="grid gap-3 max-h-80 overflow-y-auto border rounded-lg p-2">
              {repositories.map((repo) => (
                <Card
                  key={repo.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                    selectedRepo?.id === repo.id
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRepo(repo)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          <h4 className="font-medium">{repo.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {repo.language || 'Mixed'}
                          </Badge>
                          {selectedRepo?.id === repo.id && (
                            <Badge className="bg-green-500 text-white text-xs">
                              ✓ Selected
                            </Badge>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-sm text-muted-foreground overflow-hidden" 
                             style={{
                               display: '-webkit-box',
                               WebkitLineClamp: 2,
                               WebkitBoxOrient: 'vertical'
                             }}>
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            {repo.forks_count}
                          </span>
                          <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 opacity-50 hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selection Reminder */}
        {repositories.length > 0 && !selectedRepo && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-2">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600">Select a Repository</h3>
              <p className="text-sm text-gray-500">
                Choose one of the repositories above to start generating your blog post
              </p>
            </div>
          </div>
        )}

        {/* Generation Options */}
        {selectedRepo && (
          <>
            <Separator />
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">
                🎯 Ready to generate blog post for: <span className="font-bold">{selectedRepo.name}</span>
              </h3>
              <p className="text-sm text-blue-700">
                {selectedRepo.description || 'Configure the options below and click generate!'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Writing Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="focus">Content Focus</Label>
                <Select value={focus} onValueChange={setFocus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Project Overview</SelectItem>
                    <SelectItem value="technical-deep-dive">Technical Deep Dive</SelectItem>
                    <SelectItem value="learning-journey">Learning Journey</SelectItem>
                    <SelectItem value="showcase">Feature Showcase</SelectItem>
                    <SelectItem value="tutorial">Step-by-Step Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developers">Developers</SelectItem>
                    <SelectItem value="business">Business & Decision Makers</SelectItem>
                    <SelectItem value="general">General Audience</SelectItem>
                    <SelectItem value="recruiters">Recruiters</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={generateBlogPost}
                disabled={isGenerating}
                size="lg"
                className="min-w-48"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Blog Post
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}