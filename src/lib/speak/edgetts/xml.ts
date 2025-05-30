export const escape = (text: string) =>
  text.replace(/[<>"'&]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return char;
    }
  });

export const unescape = (str: string) => {
  ['&lt;', '&gt;', '&amp;', '&quot;', '&apos;'].forEach((x, i) => {
    str = str.replaceAll(x, ['<', '>', '&', '"', "'"][i]);
  });

  return str;
};
