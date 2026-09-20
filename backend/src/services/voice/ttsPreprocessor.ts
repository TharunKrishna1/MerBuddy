import { numberToWordsRupees } from '../pricingService';

export class TTSPreprocessor {
  /**
   * Preprocess LLM generated text to optimize for natural Text-To-Speech output
   */
  public preprocess(text: string, maxWords: number = 30): string {
    if (!text || typeof text !== 'string') return '';

    let cleaned = text;

    // 1. Remove markdown headings, bold, italics, links, backticks
    cleaned = cleaned.replace(/^#+\s+/gm, ''); // Headings
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Italics
    cleaned = cleaned.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Markdown links
    cleaned = cleaned.replace(/`{1,3}(.*?)`{1,3}/g, '$1'); // Code blocks

    // 2. Remove bullet lists and numbered lists prefix
    cleaned = cleaned.replace(/^\s*[\-\*\+]\s+/gm, ''); // Bullet items
    cleaned = cleaned.replace(/^\s*\d+[\.\)]\s+/gm, ''); // Numbered lists e.g. 1. 2)

    // 3. Normalize symbols for voice pronunciation
    cleaned = cleaned.replace(/&/g, 'and');
    cleaned = cleaned.replace(/%/g, ' percent');
    cleaned = cleaned.replace(/@/g, ' at ');
    cleaned = cleaned.replace(/\+/g, ' plus ');

    // 4. Convert Indian Rupee prices e.g. ₹4,999 or Rs. 4999 -> words
    cleaned = cleaned.replace(/(?:₹|Rs\.?\s*)([0-9,]+)/gi, (_, priceStr) => {
      const numericPrice = parseInt(priceStr.replace(/,/g, ''), 10);
      if (!isNaN(numericPrice)) {
        return numberToWordsRupees(numericPrice);
      }
      return priceStr;
    });

    // 5. Convert lone large numbers e.g. 999 -> speech text if applicable
    cleaned = cleaned.replace(/\b(\d+)\b/g, (match, numStr) => {
      const n = parseInt(numStr, 10);
      if (n >= 1000 && n <= 999999) {
        return numberToWordsRupees(n);
      }
      return match;
    });

    // 6. Clean excess spaces, newlines, and unneeded punctuation
    cleaned = cleaned.replace(/[\r\n]+/g, '. ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // 7. Sentence length check / Word cap for voice
    const words = cleaned.split(' ');
    if (words.length > maxWords) {
      cleaned = words.slice(0, maxWords).join(' ') + '.';
    }

    // 8. Final punctuation check
    if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
      cleaned += '.';
    }

    return cleaned;
  }
}

export const ttsPreprocessor = new TTSPreprocessor();
