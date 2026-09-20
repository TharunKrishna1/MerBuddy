export interface STTResponse {
  transcript: string;
  confidence: number;
  detectedLanguage: string;
}

export interface STTProvider {
  name: string;
  transcribe(audioBuffer: Buffer | string, languageHint?: string): Promise<STTResponse>;
}
