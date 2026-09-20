import { describe, it, expect } from 'vitest';
import { ttsPreprocessor } from '../src/services/voice/ttsPreprocessor';

describe('TTS Preprocessor Unit Tests', () => {
  it('removes markdown formatting', () => {
    const input = 'Sure! **Nike Pegasus** is *available* at [Store](http://example.com).';
    const output = ttsPreprocessor.preprocess(input);
    expect(output).not.toContain('**');
    expect(output).not.toContain('*');
    expect(output).toContain('Nike Pegasus is available at Store.');
  });

  it('removes bullet lists and numbered list prefixes', () => {
    const input = '1. First item\n2. Second item\n- Third item';
    const output = ttsPreprocessor.preprocess(input);
    expect(output).not.toContain('1.');
    expect(output).not.toContain('2.');
    expect(output).not.toContain('- ');
  });

  it('converts Rupee amounts to spoken words', () => {
    const input = 'The price of shoe is ₹4,999 with 20% discount.';
    const output = ttsPreprocessor.preprocess(input);
    expect(output).toContain('four thousand nine hundred ninety-nine rupees');
    expect(output).toContain('20 percent discount');
  });

  it('caps response word length for voice brevity', () => {
    const input = 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two.';
    const output = ttsPreprocessor.preprocess(input, 10);
    const words = output.split(' ');
    expect(words.length).toBeLessThanOrEqual(11);
  });
});
