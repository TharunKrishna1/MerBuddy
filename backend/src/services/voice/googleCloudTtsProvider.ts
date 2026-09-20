import { TTSProvider, TTSResponse } from './ttsProvider';

export class GoogleCloudTTSProvider implements TTSProvider {
  public name = 'Google Cloud Text-To-Speech API';

  public async synthesize(text: string, voiceStyle: string = 'en-IN-Wavenet-D', language: string = 'hi-IN'): Promise<TTSResponse> {
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

export const googleCloudTTS = new GoogleCloudTTSProvider();
