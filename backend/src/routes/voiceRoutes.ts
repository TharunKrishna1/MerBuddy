import { Router, Request, Response } from 'express';
import { googleCloudSTT } from '../services/voice/googleCloudSttProvider';
import { googleCloudTTS } from '../services/voice/googleCloudTtsProvider';
import { browserSTT, browserTTS } from '../services/voice/browserProvider';
import { ttsPreprocessor } from '../services/voice/ttsPreprocessor';

const router = Router();

// POST /api/voice/transcribe
router.post('/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioData, languageHint = 'hi-IN' } = req.body;
    const provider = process.env.VOICE_PROVIDER === 'google' ? googleCloudSTT : browserSTT;

    const result = await provider.transcribe(audioData || 'Bhai black running shoes size 9 mein hain kya?', languageHint);

    res.json({
      success: true,
      provider: provider.name,
      transcript: result.transcript,
      confidence: result.confidence,
      detectedLanguage: result.detectedLanguage
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/voice/synthesize
router.post('/synthesize', async (req: Request, res: Response) => {
  try {
    const { text, voiceStyle = 'friendly', maxWords = 25 } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text parameter is required for TTS synthesis.' });
    }

    const preprocessedText = ttsPreprocessor.preprocess(text, maxWords);
    const provider = process.env.VOICE_PROVIDER === 'google' ? googleCloudTTS : browserTTS;

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
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
