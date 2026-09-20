"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCloudTTS = exports.GoogleCloudTTSProvider = void 0;
class GoogleCloudTTSProvider {
    name = 'Google Cloud Text-To-Speech API';
    async synthesize(text, voiceStyle = 'en-IN-Wavenet-D', language = 'hi-IN') {
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            return {
                audioContent: '',
                format: 'browser-speech',
                durationMs: Math.max(1200, text.split(' ').length * 280)
            };
        }
        return {
            audioContent: 'BASE64_AUDIO_DATA_FROM_GCP_TTS',
            format: 'mp3',
            durationMs: Math.max(1200, text.split(' ').length * 280)
        };
    }
}
exports.GoogleCloudTTSProvider = GoogleCloudTTSProvider;
exports.googleCloudTTS = new GoogleCloudTTSProvider();
