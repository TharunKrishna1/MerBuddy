export interface TTSResponse {
  audioContent: string; // Base64 or URL
  format: 'mp3' | 'wav' | 'browser-speech';
  durationMs: number;
}

export interface TTSProvider {
  name: string;
  synthesize(text: string, voiceStyle?: string, language?: string): Promise<TTSResponse>;
}
