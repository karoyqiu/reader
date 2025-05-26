export const getAbsoluteUrl = (url: string | URL, base?: string | URL) => {
  try {
    return new URL(url, base);
  } catch (e) {
    return url;
  }
};

export const getBaseUrl = (url: string | URL) => {
  try {
    return new URL('/', url);
  } catch (e) {
    return undefined;
  }
};
