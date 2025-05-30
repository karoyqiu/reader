export const toUtf8 = (s: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(s);
};

export const fromUtf8 = (bytes: AllowSharedBufferSource, fatal?: boolean) => {
  const decoder = new TextDecoder('utf-8', { fatal });
  return decoder.decode(bytes);
};

export const inBetween = <T>(lower: T, value: T, upper: T) => lower <= value && value <= upper;

export const concatenate = (...arrays: Uint8Array[]) => {
  const totalLength = arrays.reduce((prev, a) => prev + a.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const a of arrays) {
    result.set(a, offset);
    offset += a.length;
  }

  return result;
};
