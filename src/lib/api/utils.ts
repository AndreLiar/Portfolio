/**
 * Get the base URL for API calls
 * Returns empty string for client-side, full URL for server-side
 */
export function getApiBaseUrl(): string {
  return typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9009';
}