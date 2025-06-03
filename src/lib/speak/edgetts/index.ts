import SpeakEngine from '../speak-engine';
import { communicate } from './communicate';
import { listVoices } from './voices';

export default class EdgeTTS extends SpeakEngine {
  private voice = 'zh-CN-XiaoyiNeural';

  constructor() {
    super(3);
  }

  async getVoices() {
    const voices = await listVoices();
    return voices.map((v) => v.ShortName);
  }

  protected async textToAudioData(_signal: AbortSignal, text: string, voice?: string) {
    const gen = communicate(text, voice ?? this.voice);
    const data = await gen.next();

    if (data.done) {
      return new ArrayBuffer();
    }

    gen.return();
    return data.value.buffer;
  }

  protected decodeAudioData(data: ArrayBuffer) {
    return this.ctx.decodeAudioData(data);
  }
}
