import re
from services.pricing_service import number_to_words_rupees

class TTSPreprocessor:
    def preprocess(self, text: str, max_words: int = 30) -> str:
        if not text or not isinstance(text, str):
            return ""

        cleaned = text

        # 1. Remove markdown headings, bold, italics, links, backticks
        cleaned = re.sub(r'^#+\s+', '', cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r'\*\*(.*?)\*\*', r'\1', cleaned)
        cleaned = re.sub(r'\*(.*?)\*', r'\1', cleaned)
        cleaned = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', cleaned)
        cleaned = re.sub(r'`{1,3}(.*?)`{1,3}', r'\1', cleaned)

        # 2. Remove bullet items and numbered lists prefix e.g. 1. 2)
        cleaned = re.sub(r'^\s*[\-\*\+]\s+', '', cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r'^\s*\d+[\.\)]\s+', '', cleaned, flags=re.MULTILINE)

        # 3. Normalize symbols for voice pronunciation
        cleaned = cleaned.replace('&', 'and')
        cleaned = cleaned.replace('%', ' percent')
        cleaned = cleaned.replace('@', ' at ')
        cleaned = cleaned.replace('+', ' plus ')

        # 4. Convert Indian Rupee prices e.g. ₹4,999 or Rs. 4999 -> words
        def rupee_replacer(match):
            price_str = match.group(1).replace(',', '')
            try:
                num = float(price_str)
                return number_to_words_rupees(num)
            except ValueError:
                return match.group(0)

        cleaned = re.sub(r'(?:₹|Rs\.?\s*)([0-9,]+)', rupee_replacer, cleaned, flags=re.IGNORECASE)

        # 5. Convert lone large numbers e.g. 999 -> speech text if applicable
        def num_replacer(match):
            val_str = match.group(1)
            try:
                n = int(val_str)
                if 1000 <= n <= 999999:
                    return number_to_words_rupees(n)
            except ValueError:
                pass
            return val_str

        cleaned = re.sub(r'\b(\d+)\b', num_replacer, cleaned)

        # 6. Clean excess spaces, newlines, and unneeded punctuation
        cleaned = re.sub(r'[\r\n]+', '. ', cleaned)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()

        # 7. Word cap for voice brevity
        words = cleaned.split(' ')
        if len(words) > max_words:
            cleaned = ' '.join(words[:max_words]) + '.'

        # 8. Ensure trailing punctuation
        if len(cleaned) > 0 and not re.search(r'[.!?]$', cleaned):
            cleaned += '.'

        return cleaned

tts_preprocessor = TTSPreprocessor()
