import { z } from 'zod';

// GitHub API types
export const GitHubRepo = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
  clone_url: z.string(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
  topics: z.array(z.string()).optional(),
  readme_url: z.string().optional(),
});

export const GitHubFileContent = z.object({
  name: z.string(),
  path: z.string(),
  content: z.string(),
  encoding: z.string(),
  size: z.number(),
});

export type Repository = z.infer<typeof GitHubRepo>;
export type FileContent = z.infer<typeof GitHubFileContent>;

export class GitHubService {
  private static baseUrl = 'https://api.github.com';
  private static token = process.env.GITHUB_TOKEN;

  private static async request(endpoint: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get user repositories
  static async getUserRepos(username: string): Promise<Repository[]> {
    try {
      const repos = await this.request(`/users/${username}/repos?sort=updated&per_page=50`);
      return repos.map((repo: any) => GitHubRepo.parse(repo));
    } catch (error) {
      console.error('Error fetching user repositories:', error);
      return [];
    }
  }

  // Get repository contents
  static async getRepoContents(owner: string, repo: string, path: string = ''): Promise<any[]> {
    try {
      return await this.request(`/repos/${owner}/${repo}/contents/${path}`);
    } catch (error) {
      console.error('Error fetching repository contents:', error);
      return [];
    }
  }

  // Get file content
  static async getFileContent(owner: string, repo: string, path: string): Promise<FileContent | null> {
    try {
      const file = await this.request(`/repos/${owner}/${repo}/contents/${path}`);
      
      if (file.content) {
        return GitHubFileContent.parse({
          ...file,
          content: Buffer.from(file.content, 'base64').toString('utf-8'),
        });
      }
      
      return null;
    } catch (error: any) {
      // Don't log 404 errors as they're expected for missing files
      if (!error.message?.includes('404')) {
        console.error('Error fetching file content:', error);
      }
      return null;
    }
  }

  // Get README content
  static async getReadme(owner: string, repo: string): Promise<string | null> {
    const readmeFiles = ['README.md', 'README.txt', 'README.rst', 'readme.md'];
    
    for (const filename of readmeFiles) {
      const content = await this.getFileContent(owner, repo, filename);
      if (content) {
        return content.content;
      }
    }
    
    return null;
  }

  // Get package.json for dependency analysis
  static async getPackageJson(owner: string, repo: string): Promise<any | null> {
    const content = await this.getFileContent(owner, repo, 'package.json');
    if (content) {
      try {
        return JSON.parse(content.content);
      } catch (error) {
        console.error('Error parsing package.json:', error);
      }
    }
    return null;
  }

  // Get repository languages
  static async getRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      return await this.request(`/repos/${owner}/${repo}/languages`);
    } catch (error) {
      console.error('Error fetching repository languages:', error);
      return {};
    }
  }

  // Analyze repository structure and extract key information
  static async analyzeRepository(owner: string, repo: string): Promise<{
    repository: Repository;
    readme: string | null;
    packageJson: any | null;
    languages: Record<string, number>;
    keyFiles: string[];
    structure: any[];
  }> {
    try {
      // Get repository info
      const repoData = await this.request(`/repos/${owner}/${repo}`);
      const repository = GitHubRepo.parse(repoData);

      // Get additional data in parallel
      const [readme, packageJson, languages, structure] = await Promise.all([
        this.getReadme(owner, repo),
        this.getPackageJson(owner, repo),
        this.getRepoLanguages(owner, repo),
        this.getRepoContents(owner, repo),
      ]);

      // Extract key files
      const keyFiles = structure
        .filter((file: any) => file.type === 'file')
        .map((file: any) => file.name)
        .filter((name: string) => 
          name.match(/\.(md|txt|json|js|ts|tsx|jsx|py|java|go|rs|vue|svelte)$/i) ||
          name.toLowerCase().includes('dockerfile') ||
          name.toLowerCase().includes('makefile')
        );

      return {
        repository,
        readme,
        packageJson,
        languages,
        keyFiles,
        structure,
      };
    } catch (error) {
      console.error('Error analyzing repository:', error);
      throw error;
    }
  }
}