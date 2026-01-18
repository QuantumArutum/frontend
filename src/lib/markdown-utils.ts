/**
 * Markdown utility functions
 */

/**
 * Extract plain text from Markdown content
 * Removes all Markdown syntax and returns clean text
 */
export function extractPlainText(markdown: string): string {
  if (!markdown) return '';

  let text = markdown;

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`[^`]+`/g, '');

  // Remove headers
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove bold/italic
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');

  // Remove strikethrough
  text = text.replace(/~~(.*?)~~/g, '$1');

  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // Remove horizontal rules
  text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '');

  // Remove list markers
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');

  // Remove blockquotes
  text = text.replace(/^\s*>\s+/gm, '');

  // Remove extra whitespace
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text;
}

/**
 * Create a preview excerpt from Markdown content
 * @param markdown - The Markdown content
 * @param maxLength - Maximum length of the excerpt (default: 150)
 */
export function createExcerpt(markdown: string, maxLength: number = 150): string {
  const plainText = extractPlainText(markdown);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last space before maxLength to avoid cutting words
  const excerpt = plainText.substring(0, maxLength);
  const lastSpace = excerpt.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    return excerpt.substring(0, lastSpace) + '...';
  }

  return excerpt + '...';
}
