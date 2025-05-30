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
    for await (const data of communicate(text, voice ?? this.voice)) {
      return data.buffer;
    }

    return new ArrayBuffer();
  }

  protected decodeAudioData(data: ArrayBuffer) {
    return this.ctx.decodeAudioData(data);
  }
}
