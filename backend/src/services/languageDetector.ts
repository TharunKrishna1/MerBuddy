export class LanguageDetector {
  private hinglishKeywords = [
    'bhai', 'hain', 'kya', 'chahiye', 'mein', 'kitna', 'kaise', 'milega',
    'kab', 'aayega', 'namaste', 'mujhe', 'aaj', 'par', 'hi', 'batao',
    'sasta', 'mehenga', 'discount', 'size', 'bhi', 'na', 'wala', 'wali'
  ];

  public detectLanguage(text: string): 'english' | 'hindi' | 'hinglish' {
    if (!text || typeof text !== 'string') return 'english';

    // Check for Devanagari Unicode Range
    if (/[\u0900-\u097F]/.test(text)) {
      return 'hindi';
    }

    const lower = text.toLowerCase();
    const words = lower.replace(/[^a-z0-9\s]/g, '').split(/\s+/);

    let matchCount = 0;
    for (const w of words) {
      if (this.hinglishKeywords.includes(w)) {
        matchCount++;
      }
    }

    if (matchCount >= 1) {
      return 'hinglish';
    }

    return 'english';
  }
}

export const languageDetector = new LanguageDetector();
