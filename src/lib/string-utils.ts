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
