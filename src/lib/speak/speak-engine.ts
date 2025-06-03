import EventEmitter from 'eventemitter3';
import PQueue from 'p-queue';
import { retry } from 'radashi';

import Playlist, { type PlaylistEventType } from './playlist';

export default abstract class SpeakEngine extends EventEmitter<PlaylistEventType> {
  protected readonly queue;
  protected readonly ctx = new AudioContext();
  private readonly playlist = new Playlist();
  protected ctrl: AbortController | null = null;

  protected constructor(concurrency: number) {
    super();
    this.queue = new PQueue({ concurrency });
    this.playlist.addListener('playing', (index) => this.emit('playing', index));
  }

  abstract getVoices(): Promise<string[]>;

  async speak(lines: string[], voice?: string) {
    const l = this.preprocessLines(lines);
    this.ctrl = new AbortController();
    this.playlist.reset();

    try {
      await this.queue.addAll(
        l.map((line, index) => async ({ signal }) => {
          try {
            const buffer = await retry({ delay: 1000, signal }, () =>
              this.textToSpeech(signal!, line, voice),
            );

            const audioSource = this.ctx.createBufferSource();
            audioSource.buffer = buffer;
            audioSource.connect(this.ctx.destination);

            await this.playlist.play(index, audioSource);
          } catch (e) {
            console.warn('Something went wrong', e);
            this.playlist.skip(index);
          }
        }),
        { signal: this.ctrl.signal },
      );
    } catch (e) {}

    const ok = !this.ctrl.signal.aborted;
    this.ctrl = null;

    return ok;
  }

  stop() {
    this.ctrl?.abort();
    this.queue.clear();
    this.playlist.reset();
  }

  get isPlaying() {
    return this.playlist.isPlaying;
  }

  protected preprocessLines(lines: string[]) {
    return lines.map((line) => line.trim());
  }

  protected abstract textToSpeech(
    signal: AbortSignal,
    text: string,
    voice?: string,
  ): Promise<AudioBuffer>;
}
