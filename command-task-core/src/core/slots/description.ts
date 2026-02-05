/**
 * Extract description from user input
 * Supports patterns like:
 * - "description: some text"
 * - "description some text"
 * - "desc: some text"
 * - "with description some text"
 * - "details: some text"
 */

const DESCRIPTION_PATTERNS = [
  // "description: text" or "desc: text" - captures until date/time keywords or end
  /(?:description|desc|details|note|notes)\s*[:]\s*(.+?)(?=\s+(?:for|on|at|tomorrow|today|next|this|\d{1,2}(?:st|nd|rd|th)?|\d{1,2}[:/]\d{2})|$)/i,
  
  // "description text" without colon - captures rest of input after keyword
  /^(?:description|desc|details|note|notes)\s+(.+)$/i,
  
  // "with description text" - captures until date/time keywords or end
  /with\s+(?:description|desc|details|note|notes)\s+(.+?)(?=\s+(?:for|on|at|tomorrow|today|next|this|\d{1,2}(?:st|nd|rd|th)?|\d{1,2}[:/]\d{2})|$)/i,
];

/**
 * Check if input is just the "description" keyword alone (for prompting)
 */
export function isDescriptionKeywordOnly(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return normalized === "description" || normalized === "desc" || 
         normalized === "details" || normalized === "note" || normalized === "notes";
}

export function extractDescription(text: string): string | null {
  for (const pattern of DESCRIPTION_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const description = match[1].trim();
      if (description.length > 0) {
        return description;
      }
    }
  }
  return null;
}

/**
 * Remove description from text to avoid it interfering with title extraction
 */
export function removeDescriptionFromText(text: string): string {
  let cleaned = text;
  
  for (const pattern of DESCRIPTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  // Also remove the keyword if it's at the end (with or without colon)
  cleaned = cleaned.replace(/\s+(?:description|desc|details|note|notes)\s*[:]?\s*$/i, '');
  
  return cleaned.replace(/\s+/g, ' ').trim();
}
