import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

/**
 * Convert markdown to sanitized HTML
 */
export async function mdToSafeHtml(markdown: string): Promise<string> {
  try {
    // Process markdown to HTML
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: false })
      .use(rehypeStringify)
      .process(markdown);
    
    const dirtyHtml = String(file);
    
    // Create a DOM window for DOMPurify
    const window = new JSDOM('').window;
    const purify = DOMPurify(window as any);
    
    // Configure allowed tags and attributes
    const cleanHtml = purify.sanitize(dirtyHtml, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's',
        'a', 'img', 'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'hr'
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'alt', 'src',
        'class', 'id', 'target', 'rel'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
    
    return cleanHtml;
  } catch (error) {
    console.error('Error processing markdown:', error);
    return '<p>Error processing content</p>';
  }
}


/**
 * Generate excerpt from markdown content
 */
export function generateExcerpt(markdown: string, maxLength: number = 160): string {
  // Remove markdown formatting for excerpt
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Replace links with link text
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/[*_~`]/g, '') // Remove formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}