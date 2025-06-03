import EventEmitter from 'eventemitter3';
import PQueue from 'p-queue';
import { retry } from 'radashi';

import Playlist from './playlist';

type EventType = {
  loading: () => void;
  playing: (index: number) => void;
  stopped: () => void;
};

export default abstract class SpeakEngine extends EventEmitter<EventType> {
  protected readonly queue;
  protected readonly ctrl = new AbortController();
  protected readonly ctx = new AudioContext();
  private readonly playlist = new Playlist();

  protected constructor(concurrency: number) {
    super();
    this.queue = new PQueue({ concurrency });
    this.playlist.addListener('playing', (index) => this.emit('playing', index));
  }

  abstract getVoices(): Promise<string[]>;

  async speak(lines: string[], voice?: string) {
    const l = this.preprocessLines(lines);

    await this.queue.addAll(
      l.map((line, index) => async ({ signal }) => {
        const data = await retry({ delay: 1000, signal }, () =>
          this.textToAudioData(signal!, line, voice),
        );

        const buffer = await this.decodeAudioData(data);
        const audioSource = this.ctx.createBufferSource();
        audioSource.buffer = buffer;
        audioSource.connect(this.ctx.destination);

        await this.playlist.play(index, audioSource);
      }),
      { signal: this.ctrl.signal },
    );
  }

  async stop() {
    this.ctrl.abort();
    this.queue.clear();
    this.playlist.reset();

    this.emit('stopped');
  }

  get isPlaying() {
    return this.playlist.isPlaying;
  }

  protected preprocessLines(lines: string[]) {
    return lines.map((line) => line.trim());
  }

  protected abstract textToAudioData(
    signal: AbortSignal,
    text: string,
    voice?: string,
  ): Promise<ArrayBufferLike>;
  protected abstract decodeAudioData(data: ArrayBufferLike): Promise<AudioBuffer> | AudioBuffer;
}
