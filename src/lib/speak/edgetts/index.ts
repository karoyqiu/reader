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

  protected async textToSpeech(_signal: AbortSignal, text: string, voice?: string) {
    const gen = communicate(text, voice ?? this.voice);
    const data = await gen.next();

    if (data.done) {
      throw new Error('No audio data');
    }

    gen.return();
    return this.ctx.decodeAudioData(data.value.buffer as ArrayBuffer);
  }
}
