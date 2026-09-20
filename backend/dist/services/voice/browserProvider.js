"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserTTS = exports.browserSTT = exports.BrowserTTSProvider = exports.BrowserSTTProvider = void 0;
class BrowserSTTProvider {
    name = 'Browser Web Speech API (Fallback)';
    async transcribe(audioData) {
        // In browser demo mode, transcription is performed directly in client web speech engine or submitted via text string
        const transcriptText = typeof audioData === 'string' ? audioData : 'Bhai black running shoes size 9 mein hain kya?';
        return {
            transcript: transcriptText,
            confidence: 0.96,
            detectedLanguage: 'hinglish'
        };
    }
}
exports.BrowserSTTProvider = BrowserSTTProvider;
class BrowserTTSProvider {
    name = 'Browser Web Speech API (Fallback)';
    async synthesize(text) {
        return {
            audioContent: '', // Browser handles synthesis locally via window.speechSynthesis
            format: 'browser-speech',
            durationMs: Math.max(1000, text.split(' ').length * 300)
        };
    }
}
exports.BrowserTTSProvider = BrowserTTSProvider;
exports.browserSTT = new BrowserSTTProvider();
exports.browserTTS = new BrowserTTSProvider();
