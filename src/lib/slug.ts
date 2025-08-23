/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug by appending a number if the slug already exists
 */
export async function generateUniqueSlug(
  title: string,
  checkExists: (slug: string) => Promise<boolean>,
  currentSlug?: string
): Promise<string> {
  const baseSlug = slugify(title);
  
  // If this is the same as the current slug, keep it
  if (currentSlug === baseSlug) {
    return baseSlug;
  }
  
  // Check if base slug is available
  if (!(await checkExists(baseSlug))) {
    return baseSlug;
  }
  
  // Try numbered variations
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (await checkExists(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}