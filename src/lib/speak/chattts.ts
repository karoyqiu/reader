import { fetch } from '@tauri-apps/plugin-http';

import SpeakEngine from './speak-engine';

//const baseUrl = new URL('http://192.168.0.104:9966/');
const baseUrl = new URL('http://127.0.0.1:9966/');
const ttsUrl = new URL('/tts', baseUrl);

type ResponseType = {
  code: number;
  msg: string;
  audio_files: AudioFile[];
};

type AudioFile = {
  filename: string;
  url: string;
};

export default class ChatTTS extends SpeakEngine {
  constructor() {
    super(4);
  }

  async getVoices() {
    return ['7777.pt'];
  }

  protected async textToSpeech(signal: AbortSignal, text: string, voice?: string) {
    const ttsResp = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams({
        text,
        prompt: '',
        voice: voice ?? '7777.pt',
        speed: '1',
        temperature: '0.1',
        top_p: '0.5',
        top_k: '20',
        refine_max_new_token: '384',
        infer_max_new_token: '2048',
        text_seed: '42',
        skip_refine: '1',
        custom_voice: '0',
      }),
      signal,
    });

    const resp = (await ttsResp.json()) as ResponseType;

    if (resp.code !== 0) {
      console.error('Failed to tts', resp);
      throw new Error(resp.msg);
    }

    if (resp.audio_files.length !== 1) {
      console.warn('Multiple audio files', resp);
    }

    const wavResp = await fetch(resp.audio_files[0].url, { signal });
    const buffer = await wavResp.arrayBuffer();
    return this.ctx.decodeAudioData(buffer);
  }
}
