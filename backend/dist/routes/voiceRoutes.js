"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleCloudSttProvider_1 = require("../services/voice/googleCloudSttProvider");
const googleCloudTtsProvider_1 = require("../services/voice/googleCloudTtsProvider");
const browserProvider_1 = require("../services/voice/browserProvider");
const ttsPreprocessor_1 = require("../services/voice/ttsPreprocessor");
const router = (0, express_1.Router)();
// POST /api/voice/transcribe
router.post('/transcribe', async (req, res) => {
    try {
        const { audioData, languageHint = 'hi-IN' } = req.body;
        const provider = process.env.VOICE_PROVIDER === 'google' ? googleCloudSttProvider_1.googleCloudSTT : browserProvider_1.browserSTT;
        const result = await provider.transcribe(audioData || 'Bhai black running shoes size 9 mein hain kya?', languageHint);
        res.json({
            success: true,
            provider: provider.name,
            transcript: result.transcript,
            confidence: result.confidence,
            detectedLanguage: result.detectedLanguage
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// POST /api/voice/synthesize
router.post('/synthesize', async (req, res) => {
    try {
        const { text, voiceStyle = 'friendly', maxWords = 25 } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, error: 'Text parameter is required for TTS synthesis.' });
        }
        const preprocessedText = ttsPreprocessor_1.ttsPreprocessor.preprocess(text, maxWords);
        const provider = process.env.VOICE_PROVIDER === 'google' ? googleCloudTtsProvider_1.googleCloudTTS : browserProvider_1.browserTTS;
        const ttsResult = await provider.synthesize(preprocessedText, voiceStyle);
        res.json({
            success: true,
            provider: provider.name,
            originalText: text,
            preprocessedText,
            audioContent: ttsResult.audioContent,
            format: ttsResult.format,
            durationMs: ttsResult.durationMs
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
