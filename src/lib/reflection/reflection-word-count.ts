/**
 * Sleep Diary v2.3 — Word Counting and Word Limit Enforcement
 *
 * Unicode-aware word counting for en/es/pt-BR/pl.
 * Consistent between client and future server.
 * Punctuation-only tokens are not counted as words.
 */

export const MAX_WORDS = 750;
export const RECOMMENDED_MIN = 300;
export const RECOMMENDED_MAX = 500;

/**
 * Count words in a Unicode-aware way.
 *
 * Rules:
 * - Empty input = 0
 * - Repeated whitespace ignored
 * - Punctuation-only tokens not counted
 * - Line breaks handled
 *
 * Works for space-separated languages (en, es, pt-BR, pl)
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  // Normalize whitespace: collapse multiple spaces/newlines to single space
  const normalized = text.replace(/\s+/g, " ").trim();

  // Split by spaces and filter out:
  // - empty strings
  // - tokens that are only punctuation or numbers
  const tokens = normalized.split(" ").filter((token) => {
    if (!token) return false;
    // A token counts as a word if it contains at least one letter character
    // This handles punctuation at start/end of words (e.g., "hello!", "(note")
    return /\p{L}/u.test(token);
  });

  return tokens.length;
}

/**
 * Check if adding new content would exceed the word limit.
 */
export function wouldExceedLimit(currentText: string, newText: string): boolean {
  return countWords(newText) > MAX_WORDS;
}

/**
 * Truncate text to stay within word limit.
 * Preserves the content at or under the limit.
 */
export function truncateToWordLimit(text: string): string {
  const words = text.split(/\s+/);
  let result = "";
  let wordCount = 0;

  for (const word of words) {
    if (!word) continue;
    if (/\p{L}/u.test(word)) {
      if (wordCount >= MAX_WORDS) break;
      wordCount++;
    }
    result += (result ? " " : "") + word;
  }

  return result;
}

/**
 * Get the percentage of words used (0-100).
 */
export function wordUsagePercentage(text: string): number {
  const count = countWords(text);
  return Math.min(100, Math.round((count / MAX_WORDS) * 100));
}
