import { fetch } from '@tauri-apps/plugin-http';
import { EventEmitter } from 'eventemitter3';
import PQueue from 'p-queue';

const baseUrl = new URL('http://192.168.0.104:5000');
const sftUrl = new URL('/inference_sft', baseUrl);

const textToSpeech = async (signal: AbortSignal, text: string, speaker = 'xiaohe') => {
  const resp = await fetch(sftUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ tts_text: text, spk_id: speaker }),
    signal,
  });
  const buffer = await resp.arrayBuffer();
  const int16s = new Int16Array(buffer);
  return new Float32Array([...int16s].map((n) => n / 32768));
};

type EventName = 'loading' | 'playing' | 'stopped';

export default class CosyVoice extends EventEmitter<EventName> {
  private readonly queue = new PQueue({ concurrency: 10 });
  private readonly ctrl = new AbortController();
  private readonly ctx = new AudioContext();
  private audioSource: AudioBufferSourceNode | null = null;
  private data: Float32Array[] = [];
  private index = 0;

  async speak(lines: string[]) {
    this.data = new Array<Float32Array>(lines.length);

    await this.queue.addAll(
      lines.map((line, index) => async ({ signal }) => {
        console.debug('TTS for line', index);
        const buffer = await textToSpeech(signal!, line);
        this.data[index] = buffer;
        console.debug('TTSed for line', index);

        this.speakFirst();
      }),
      { signal: this.ctrl.signal },
    );
  }

  async stop() {
    this.ctrl.abort();
    this.queue.clear();
    this.audioSource?.stop();
    this.audioSource = null;
  }

  get isPlaying() {
    return this.data.length > 0;
  }

  private speakFirst() {
    if (!this.audioSource) {
      this.audioSource = this.ctx.createBufferSource();
      this.speakNext();
    }
  }

  private speakNext() {
    const data = this.data[this.index];

    if (data) {
      // 有数据，直接播放
      console.debug('Speaking line', this.index);
      const buffer = this.ctx.createBuffer(1, data.length, 24000);
      buffer.copyToChannel(data, 0);
      this.data[this.index] = new Float32Array(0);

      this.audioSource = this.ctx.createBufferSource();
      this.audioSource.buffer = buffer;
      this.audioSource.connect(this.ctx.destination);
      this.audioSource.addEventListener('ended', () => this.speakNext());
      this.audioSource.start();

      this.emit('playing', this.index);
      this.index += 1;
    } else if (this.index < this.data.length - 1) {
      // 没数据，也没全部播完
      console.debug('Waiting for data', this.index);
      this.audioSource = null;
      this.emit('loading');
    } else {
      // 全部播完了
      console.debug('All done');
      this.audioSource = null;
      this.index = 0;
      this.data = [];
      this.emit('stopped');
    }
  }
}
