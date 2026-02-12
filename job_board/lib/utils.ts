/**
 * Utility functions for the Job Board application
 */

/**
 * Strips HTML tags from a string
 * @param html The HTML string to strip
 * @returns Plain text version of the string
 */
export function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Basic regex for server-side or non-DOM environments
    return html.replace(/<[^>]*>?/gm, '');
  }
  
  // Use DOM parser for more accurate stripping in the browser
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

/**
 * Truncates a string to a specific length and adds an ellipsis
 * @param str The string to truncate
 * @param length Max length
 * @returns Truncated string
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
