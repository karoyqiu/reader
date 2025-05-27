import type { ZodMiniType } from 'zod/v4-mini';

export const isJson = (s: string) => {
  const trimmed = s.trim();
  return (
    (trimmed.startsWith('{') && s.endsWith('}')) || (trimmed.startsWith('[') && s.endsWith(']'))
  );
};

export const isJsonArray = (s: string) => {
  const trimmed = s.trim();
  return trimmed.startsWith('[') && s.endsWith(']');
};

export const fromJsonArray = <T>(s: string) => {
  try {
    const obj = JSON.parse(s);

    if (Array.isArray(obj)) {
      return obj as T[];
    }
  } catch (e) {}

  return null;
};

export const fromJson = <T extends ZodMiniType>(s: string, schema: T) => {
  try {
    const obj = JSON.parse(s);
    return schema.parse(obj);
  } catch (e) {}

  return null;
};

const dataUrlRegex = /^data:.*?;base64,(.*)/;

export const isDataUrl = (url: string) => dataUrlRegex.test(url);
