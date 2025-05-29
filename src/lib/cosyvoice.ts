import { fetch } from '@tauri-apps/plugin-http';

const baseUrl = new URL('http://192.168.0.104:5000');
const sftUrl = new URL('/inference_sft', baseUrl);

export const textToSpeech = async (text: string, speaker = 'xiaohe') => {
  const resp = await fetch(sftUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ tts_text: text, spk_id: speaker }),
  });
  const buffer = await resp.arrayBuffer();
  const int16s = new Int16Array(buffer);
  return new Float32Array([...int16s].map((n) => n / 32768));
};
