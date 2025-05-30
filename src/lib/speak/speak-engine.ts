import EventEmitter from 'eventemitter3';
import PQueue from 'p-queue';

const emptyBuffer = new ArrayBuffer(0);

type EventName = 'loading' | 'playing' | 'stopped';

export default abstract class SpeakEngine extends EventEmitter<EventName> {
  protected readonly queue;
  protected readonly ctrl = new AbortController();
  protected readonly ctx = new AudioContext();
  protected audioSource: AudioBufferSourceNode | null = null;
  protected data: ArrayBuffer[] = [];
  protected index = 0;

  protected constructor(concurrency: number) {
    super();
    this.queue = new PQueue({ concurrency });
  }

  async speak(lines: string[]) {
    const l = this.preprocessLines(lines);
    this.data = new Array<ArrayBuffer>(l.length);

    await this.queue.addAll(
      l.map((line, index) => async ({ signal }) => {
        console.debug('TTS for line', index);
        const data = await this.textToAudioData(signal!, line);
        this.data[index] = data;
        console.debug('TTSed for line', index);

        await this.speakFirst();
      }),
      { signal: this.ctrl.signal },
    );
  }

  async stop() {
    this.ctrl.abort();
    this.queue.clear();
    this.audioSource?.stop();
    this.audioSource = null;

    await this.onStop();
  }

  get isPlaying() {
    return this.data.length > 0;
  }

  protected preprocessLines(lines: string[]) {
    return lines;
  }

  protected async speakFirst() {
    if (!this.audioSource) {
      this.audioSource = this.ctx.createBufferSource();
      await this.speakNext();
    }
  }

  protected async speakNext() {
    const data = this.data[this.index];

    if (data) {
      // 有数据，直接播放
      console.debug('Speaking line', this.index);
      const buffer = await this.decodeAudioData(data);
      this.data[this.index] = emptyBuffer;

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

      await this.onStop();
    }
  }

  protected async onStop() {}

  protected abstract textToAudioData(signal: AbortSignal, text: string): Promise<ArrayBuffer>;
  protected abstract decodeAudioData(data: ArrayBuffer): Promise<AudioBuffer> | AudioBuffer;
}
