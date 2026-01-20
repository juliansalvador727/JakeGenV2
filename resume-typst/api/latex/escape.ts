/**
 * LaTeX Escape Utilities
 * 
 * Safely escapes user input for inclusion in LaTeX documents.
 * Handles all special LaTeX characters to prevent compilation errors
 * and potential injection attacks.
 */

// LaTeX special characters that need escaping
const LATEX_SPECIAL_CHARS: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '{': '\\{',
  '}': '\\}',
  '$': '\\$',
  '&': '\\&',
  '#': '\\#',
  '%': '\\%',
  '_': '\\_',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
};

// Characters that are safe in URLs but need escaping in regular text
const URL_SAFE_CHARS = new Set(['%', '#', '&']);

/**
 * Escape a string for safe inclusion in LaTeX
 * @param text - The text to escape
 * @returns Escaped text safe for LaTeX
 */
export function escapeLatex(text: string | undefined | null): string {
  if (!text) return '';
  
  let result = '';
  for (const char of text) {
    if (char in LATEX_SPECIAL_CHARS) {
      result += LATEX_SPECIAL_CHARS[char];
    } else {
      result += char;
    }
  }
  
  return result;
}

/**
 * Escape text for use in a URL within \href{}
 * URLs need different escaping - we only escape characters that break LaTeX parsing
 * @param url - The URL to escape
 * @returns Escaped URL safe for use in \href{}
 */
export function escapeLatexUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  // For URLs, we only need to escape characters that would break LaTeX parsing
  // The % character needs special handling as it starts comments
  // The # character needs escaping as it's a parameter marker
  let result = '';
  for (const char of url) {
    if (char === '%') {
      result += '\\%';
    } else if (char === '#') {
      result += '\\#';
    } else if (char === '~') {
      result += '\\~{}';
    } else {
      result += char;
    }
  }
  
  return result;
}

/**
 * Escape text for display in \href{}{text}
 * This is for the visible link text, not the URL itself
 * @param text - The display text to escape
 * @returns Escaped text
 */
export function escapeLatexLinkText(text: string | undefined | null): string {
  // Link text uses regular escaping plus underline for formatting
  return escapeLatex(text);
}

/**
 * Strip protocol and trailing slashes from a URL for display
 * @param url - The URL to clean
 * @returns Cleaned URL for display
 */
export function cleanUrlForDisplay(url: string | undefined | null): string {
  if (!url) return '';
  
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

/**
 * Format a URL for use in \href{} - ensures it has a protocol
 * @param url - The URL to format
 * @returns URL with protocol
 */
export function formatUrlForHref(url: string | undefined | null): string {
  if (!url) return '';
  
  // If URL doesn't have a protocol, add https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  
  return url;
}

/**
 * Escape and format a bullet point
 * - Escapes special characters
 * - Trims whitespace
 * - Returns empty string for empty/whitespace-only bullets
 * @param bullet - The bullet text
 * @returns Formatted and escaped bullet
 */
export function formatBullet(bullet: string | undefined | null): string {
  if (!bullet) return '';
  
  const trimmed = bullet.trim();
  if (!trimmed) return '';
  
  return escapeLatex(trimmed);
}

/**
 * Filter out empty bullets from an array
 * @param bullets - Array of bullet strings
 * @returns Array with non-empty bullets
 */
export function filterEmptyBullets(bullets: string[]): string[] {
  return bullets.filter((b) => b && b.trim() !== '');
}

/**
 * Validate that text doesn't contain potentially dangerous LaTeX commands
 * This is a safety check to prevent LaTeX injection
 * @param text - Text to check
 * @returns true if text appears safe
 */
export function isSafeLatexInput(text: string): boolean {
  // Check for potentially dangerous commands
  const dangerousPatterns = [
    /\\input\{/i,
    /\\include\{/i,
    /\\write/i,
    /\\immediate/i,
    /\\openout/i,
    /\\closeout/i,
    /\\newwrite/i,
    /\\special\{/i,
    /\\catcode/i,
  ];
  
  return !dangerousPatterns.some((pattern) => pattern.test(text));
}
