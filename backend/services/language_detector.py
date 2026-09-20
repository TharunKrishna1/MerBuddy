import re

class LanguageDetector:
    def __init__(self):
        self.hinglish_keywords = {
            'bhai', 'hain', 'kya', 'chahiye', 'mein', 'kitna', 'kaise', 'milega',
            'kab', 'aayega', 'namaste', 'mujhe', 'aaj', 'par', 'hi', 'batao',
            'sasta', 'mehenga', 'discount', 'size', 'bhi', 'na', 'wala', 'wali'
        }

    def detect_language(self, text: str) -> str:
        if not text or not isinstance(text, str):
            return 'english'

        # Check Devanagari script
        if re.search(r'[\u0900-\u097F]', text):
            return 'hindi'

        words = re.sub(r'[^a-z0-9\s]', '', text.lower()).split()
        match_count = sum(1 for w in words if w in self.hinglish_keywords)

        if match_count >= 1:
            return 'hinglish'

        return 'english'

language_detector = LanguageDetector()
