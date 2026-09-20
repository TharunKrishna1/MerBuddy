import { STTProvider, STTResponse } from './sttProvider';
import { TTSProvider, TTSResponse } from './ttsProvider';

export class BrowserSTTProvider implements STTProvider {
  public name = 'Browser Web Speech API (Fallback)';

  public async transcribe(audioData: string | Buffer): Promise<STTResponse> {
    // In browser demo mode, transcription is performed directly in client web speech engine or submitted via text string
    const transcriptText = typeof audioData === 'string' ? audioData : 'Bhai black running shoes size 9 mein hain kya?';
    return {
      transcript: transcriptText,
      confidence: 0.96,
      detectedLanguage: 'hinglish'
    };
  }
}

export class BrowserTTSProvider implements TTSProvider {
  public name = 'Browser Web Speech API (Fallback)';

  public async synthesize(text: string): Promise<TTSResponse> {
    return {
      audioContent: '', // Browser handles synthesis locally via window.speechSynthesis
      format: 'browser-speech',
      durationMs: Math.max(1000, text.split(' ').length * 300)
    };
  }
}

export const browserSTT = new BrowserSTTProvider();
export const browserTTS = new BrowserTTSProvider();
