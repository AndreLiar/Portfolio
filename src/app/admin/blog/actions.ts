// Blog-related server actions and utilities

export async function getAllTags(): Promise<string[]> {
  // For now, return some common blog tags
  // In a real implementation, this would fetch from your database
  return [
    'web-development',
    'react',
    'nextjs',
    'typescript',
    'javascript',
    'frontend',
    'backend',
    'fullstack',
    'programming',
    'tutorial',
    'guide',
    'tips',
    'best-practices',
    'performance',
    'security',
    'testing',
    'deployment',
    'tools',
    'productivity',
    'career'
  ];
}