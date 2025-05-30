/** Represents the internal TTS configuration for edge-tts's Communicate class. */
export default class Config {
  voice: string;
  rate: string;
  volume: string;
  pitch: string;

  constructor(voice: string, rate: string, volume: string, pitch: string) {
    this.voice = voice;
    this.rate = rate;
    this.volume = volume;
    this.pitch = pitch;

    // Validates the TTSConfig object
    // Possible values for voice are:
    // - Microsoft Server Speech Text to Speech Voice (cy-GB, NiaNeural)
    // - cy-GB-NiaNeural
    // - fil-PH-AngeloNeural
    // Always send the first variant as that is what Microsoft Edge does.
    const match = /^([a-z]{2,})-([A-Z]{2,})-(.+Neural)$/.exec(voice);

    if (match) {
      const lang = match[1];
      let region = match[2];
      let name = match[3];

      const pos = name.indexOf('-');

      if (pos !== -1) {
        region = `${region}-${name.slice(0, pos)}`;
        name = name.slice(pos + 1);
      }

      this.voice = `Microsoft Server Speech Text to Speech Voice (${lang}-${region}, ${name})`;
    }

    // Validate the rate, volume, and pitch parameters.
    this.validateParam('voice', /^Microsoft Server Speech Text to Speech Voice \(.+,.+\)$/);
    this.validateParam('rate', /^[+-]\d+%$/);
    this.validateParam('volume', /^[+-]\d+%$/);
    this.validateParam('pitch', /^[+-]\d+Hz$/);
  }

  /**
   * Validates the given string parameter based on type and pattern.
   * @param key The name of the parameter.
   * @param regExp The pattern to validate the parameter against.
   */
  private validateParam(key: keyof Config, regExp: RegExp) {
    const value = this[key];

    if (!regExp.test(value)) {
      throw new RangeError(`Invalid ${key} '${value}'.`);
    }
  }
}
