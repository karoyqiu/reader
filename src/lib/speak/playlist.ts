import EventEmitter from 'eventemitter3';

type EventType = {
  playing: (index: number) => void;
};

export default class Playlist extends EventEmitter<EventType> {
  private readonly sources = new Map<number, AudioBufferSourceNode | 'skip'>();
  private playing: AudioBufferSourceNode | null = null;
  private next = 0;

  get isPlaying() {
    return !!this.playing;
  }

  reset() {
    this.playing?.stop();
    this.playing = null;
    this.sources.clear();
    this.next = 0;
  }

  play(index: number, source: AudioBufferSourceNode) {
    const { promise, resolve } = Promise.withResolvers<void>();
    source.addEventListener('ended', () => {
      resolve();
      this.playNext();
    });

    if (index === this.next) {
      this.emit('playing', this.next);
      this.playing = source;
      source.start();
    } else {
      this.sources.set(index, source);
    }

    return promise;
  }

  skip(index: number) {
    if (index === this.next) {
      this.playNext();
    } else {
      this.sources.set(index, 'skip');
    }
  }

  private playNext() {
    this.next += 1;
    const source = this.sources.get(this.next);

    if (source) {
      this.sources.delete(this.next);

      if (source === 'skip') {
        this.playNext();
      } else {
        this.emit('playing', this.next);
        this.playing = source;
        source.start();
      }
    }
  }
}
