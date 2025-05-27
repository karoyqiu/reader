import { isNullish } from 'radashi';

export default class RuleData extends Map<string, string> {
  put(key: string, value?: string | null) {
    if (isNullish(value)) {
      return this.delete(key);
    }

    this.set(key, value);
    return true;
  }
}
