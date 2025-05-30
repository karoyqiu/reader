import { fetch } from '@tauri-apps/plugin-http';

import SpeakEngine from './speak-engine';

const baseUrl = new URL('http://192.168.0.104:5000/');
const sftUrl = new URL('/inference_sft', baseUrl);

export default class CosyVoice extends SpeakEngine {
  constructor() {
    super(10);
  }

  async getVoices() {
    return ['xiaohe'];
  }

  protected async textToAudioData(signal: AbortSignal, text: string, voice?: string) {
    const resp = await fetch(sftUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams({ tts_text: text, spk_id: voice ?? 'xiaohe' }),
      signal,
    });

    return resp.arrayBuffer();
  }

  protected decodeAudioData(data: ArrayBuffer) {
    const i16 = new Int16Array(data);
    const f32 = new Float32Array([...i16].map((n) => n / 32768));
    const buffer = this.ctx.createBuffer(1, f32.length, 24000);
    buffer.copyToChannel(f32, 0);
    return buffer;
  }
}
