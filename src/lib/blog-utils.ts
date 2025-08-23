import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date string for display in blog posts
 */
export function formatBlogDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return format(date, 'MMMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a date for RSS feeds (RFC 822 format)
 */
export function formatRSSDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return new Date().toUTCString();
    }
    return date.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Unknown time';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
      }
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  } catch {
    return 'Unknown time';
  }
}

/**
 * Validate and clean tag names
 */
export function sanitizeTagName(tagName: string): string {
  return tagName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .slice(0, 50); // Max 50 characters
}

/**
 * Parse comma-separated tags from input
 */
export function parseTagsFromInput(input: string): string[] {
  return input
    .split(',')
    .map(tag => sanitizeTagName(tag))
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Max 10 tags per post
}

/**
 * Calculate reading time estimate from markdown content
 */
export function calculateReadingTime(markdown: string): number {
  // Remove markdown formatting for word count
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Replace links with link text
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  const wordsPerMinute = 200;
  const wordCount = plainText.split(' ').length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Generate a page title for blog pages
 */
export function generateBlogTitle(
  pageTitle?: string,
  siteTitle: string = 'Blog'
): string {
  if (!pageTitle) {
    return siteTitle;
  }
  return `${pageTitle} | ${siteTitle}`;
}