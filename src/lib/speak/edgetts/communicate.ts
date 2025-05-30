import WebSocket from '@tauri-apps/plugin-websocket';

import Config from './config';
import { SEC_MS_GEC_VERSION, WSS_HEADERS, WSS_URL } from './constants';
import { generateSecMsGec } from './drm';
import { concatenate, fromUtf8, inBetween, toUtf8 } from './utils';
import { escape } from './xml';

/** TTS chunk data. */
export type TTSChunk =
  | {
      type: 'audio';
      data: ArrayBuffer;
    }
  | {
      type: 'WordBoundary';
      duration: number;
      offset: number;
      text: string;
    };

/**
 * Communicate with the service and streams audio and metadata from the service.
 *
 * @param signal The abort signal.
 * @param text The text to speech.
 * @param voice The voice to use.
 */
export async function* communicate(text: string, voice: string) {
  // Validate TTS settings and store the Config object.
  const config = new Config(voice, '+0%', '+0%', '+0Hz');

  // Split the text into multiple strings and store them.
  const texts = splitTextByByteLength(
    escape(removeIncompatibleCharacters(text)),
    calcMaxMesgSize(config),
  );

  // Stream the audio and metadata from the service.
  for (const text of texts) {
    yield stream(config, text);
  }
}

/**
 * Splits text into chunks, each not exceeding a maximum byte length.
 *
 * This function prioritizes splitting at natural boundaries (newlines, spaces) while ensuring that:
 * 1. No chunk exceeds `byte_length` bytes.
 * 2. Chunks do not end with an incomplete UTF-8 multi-byte character.
 * 3. Chunks do not split XML entities (like `&amp;`) in the middle.
 *
 * @param text The input text.
 * @param byteLength The maximum allowed byte length for any yielded chunk. Must be positive.
 *
 * @yields Text chunks (UTF-8 encoded, stripped of leading/trailing whitespace)
 *         that conform to the byte length and integrity constraints.
 */
function* splitTextByByteLength(text: string, byteLength: number) {
  console.assert(byteLength > 0);

  let bytes = toUtf8(text);

  while (bytes.length > byteLength) {
    // Find the initial split point based on whitespace or UTF-8 boundary
    let splitAt = findLastNewlineOrSpaceWithinLimit(bytes, byteLength);

    if (splitAt < 0) {
      // No newline or space found, so we need to find a safe UTF-8 split point
      splitAt = findSafeUtf8SplitPoint(bytes);
    }

    // TODO: Adjust the split point to avoid cutting in the middle of an xml entity, such as '&amp;'
    // splitAt = adjustSplitPointForXmlEntity(bytes, splitAt);

    if (splitAt < 0) {
      // This should not happen if byte_length is reasonable, but guards against edge cases.
      throw new Error(
        "Maximum byte length is too small or invalid text structure near '&' or invalid UTF-8",
      );
    }

    // Yield the chunk
    const chunk = fromUtf8(bytes.slice(0, splitAt)).trim();

    if (chunk.length > 0) {
      yield chunk;
    }

    // Prepare for the next iteration
    // If splitAt became 0 after adjustment, advance by 1 to avoid infinite loop
    bytes = bytes.slice(splitAt > 0 ? splitAt : 1);
  }

  // Yield the remaining part
  const chunk = fromUtf8(bytes).trim();

  if (chunk.length > 0) {
    yield chunk;
  }
}

const NEWLINE = '\n'.charCodeAt(0);
const SPACE = ' '.charCodeAt(0);

/**
 * Finds the index of the rightmost preferred split character (newline or space)
 * within the initial `limit` bytes of the text.
 *
 * This helps find a natural word or sentence boundary for splitting, prioritizing
 * newlines over spaces.
 *
 * @param bytes The byte string to search within.
 * @param limit The maximum index (exclusive) to search up to.
 * @returns The index of the last found newline or space within the limit,
 *          or -1 if neither is found in that range.
 */
const findLastNewlineOrSpaceWithinLimit = (bytes: Uint8Array, limit: number) => {
  const limited = bytes.slice(0, limit);

  // Prioritize finding a newline character
  let pos = limited.lastIndexOf(NEWLINE);

  // If no newline is found, search for a space
  if (pos < 0) {
    pos = limited.lastIndexOf(SPACE);
  }

  return pos;
};

/**
 * Finds the rightmost possible byte index such that the
 * segment `text_segment[:index]` is a valid UTF-8 sequence.
 *
 * This prevents splitting in the middle of a multi-byte UTF-8 character.
 *
 * @param bytes The byte segment being considered for splitting.
 * @returns The index of the safe split point. Returns 0 if no valid split
 *          point is found (e.g., if the first byte is part of a multi-byte
 *          sequence longer than the limit allows).
 */
const findSafeUtf8SplitPoint = (bytes: Uint8Array) => {
  let pos = bytes.length;

  while (pos > 0) {
    try {
      const segment = bytes.slice(0, pos);
      fromUtf8(segment, true);
      // Found the largest valid UTF-8 sequence
      break;
    } catch (e) {
      if (e instanceof TypeError) {
        // The byte at pos-1 is part of an incomplete multi-byte char, try earlier
        pos -= 1;
      } else {
        throw e;
      }
    }
  }

  return pos;
};

/**
 * The service does not support a couple character ranges.
 * Most important being the vertical tab character which is
 * commonly present in OCR-ed PDFs. Not doing this will
 * result in an error from the service.
 *
 * @param s The string to be cleaned.
 * @returns The cleaned string.
 */
const removeIncompatibleCharacters = (s: string) => {
  const chars: string[] = [];

  for (const char of s) {
    const code = char.charCodeAt(0);

    if (inBetween(0, code, 8) || inBetween(11, code, 12) || inBetween(14, code, 31)) {
      chars.push(' ');
    } else {
      chars.push(char);
    }
  }

  return chars.join('');
};

/**
 * Calculates the maximum message size for the given voice, rate, and volume.
 *
 * @param config The TTS configuration.
 * @returns The maximum message size.
 */
const calcMaxMesgSize = (config: Config) => {
  const maxSize = 1 << 16;
  const overhead = ssmlHeadersPlusData(connectId(), dateToString(), mkssml(config, '')).length + 50;
  return maxSize - overhead;
};

/** Returns the headers and data to be used in the request. */
const ssmlHeadersPlusData = (requestId: string, timestamp: string, ssml: string) =>
  `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${timestamp}Z\r\nPath:ssml\r\n\r\n${ssml}`;

/** Returns a UUID without dashes. */
const connectId = () => crypto.randomUUID().replaceAll('-', '');

/** Return Javascript-style date string. */
const dateToString = () => new Date().toUTCString();

/**
 * Creates a SSML string from the given parameters.
 *
 * @param config The TTS configuration.
 * @param escapedText The escaped text. If bytes, it must be UTF-8 encoded.
 * @returns The SSML string.
 */
const mkssml = (config: Config, escapedText: string) =>
  `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${config.voice}"><prosody pitch="${config.pitch}" rate="${config.rate}" volume="${config.volume}">${escapedText}</prosody></voice></speak>`;

const stream = async (config: Config, text: string) =>
  new Promise<Uint8Array>(async (resolve, reject) => {
    const url = `${WSS_URL}&Sec-MS-GEC=${await generateSecMsGec()}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${connectId()}`;
    const ws = await WebSocket.connect(url, { headers: WSS_HEADERS });
    let buffer = new Uint8Array();

    ws.addListener((msg) => {
      switch (msg.type) {
        case 'Text':
          {
            const { headers } = getHeadersAndBody(msg.data, msg.data.indexOf('\r\n\r\n'));

            if (headers['Path'] === 'turn.end') {
              resolve(buffer);
              ws.disconnect();
            }
          }
          break;

        case 'Binary':
          {
            if (msg.data.length < 2) {
              reject(
                new Error('We received a binary message, but it is missing the header length.'),
              );
              return;
            }

            const data = Uint8Array.from(msg.data);
            const view = new DataView(data.buffer);

            // The first two bytes of the binary message contain the header length.
            const headerLength = view.getInt16(0, false);

            if (headerLength > data.length) {
              reject(new RangeError('The header length is greater than the length of the data.'));
              return;
            }

            // Parse the headers and data from the binary message.
            const { headers, body } = getHeadersAndBody(data.slice(2), headerLength - 2);

            if (headers['Path'] !== 'audio') {
              reject(new Error('Received binary message, but the path is not audio.'));
              return;
            }

            switch (headers['Content-Type']) {
              case 'audio/mpeg':
                break;

              case undefined:
                // We only allow no Content-Type if there is no data.
                if (body.length !== 0) {
                  reject(new Error('Received binary message with no Content-Type, but with data.'));
                }
                return;

              default:
                reject(new Error('Received binary message, but with an unexpected Content-Type.'));
                return;
            }

            if (headers['Content-Type'] !== 'audio/mpeg') {
              reject(new Error('Received binary message, but with an unexpected Content-Type.'));
              return;
            }

            if (body.length === 0) {
              reject(new Error('Received binary message, but it is missing the audio data.'));
              return;
            }

            buffer = concatenate(buffer, body);
          }
          break;

        case 'Close':
          if (buffer.length === 0) {
            reject(new Error(msg.data?.reason));
          }
          break;

        default:
          if (typeof msg === 'string') {
            reject(new Error(msg));
          }

          break;
      }
    });

    // Sends the command request to the service
    await ws.send(
      `X-Timestamp:{date_to_string()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`,
    );

    // Sends the SSML request to the service
    await ws.send(ssmlHeadersPlusData(connectId(), dateToString(), mkssml(config, text)));
  });

/**
 * Returns the headers and data from the given body.
 * @param data The data to be parsed.
 * @param headerLength The length of the header.
 * @returns The headers and body to be used in the request.
 */
function getHeadersAndBody(
  data: string,
  headerLength: number,
): { headers: Record<string, string>; body: string };
function getHeadersAndBody(
  data: Uint8Array,
  headerLength: number,
): { headers: Record<string, string>; body: Uint8Array };
function getHeadersAndBody(data: string | Uint8Array, headerLength: number) {
  const header = data.slice(0, headerLength);
  const lines = typeof header === 'string' ? header : fromUtf8(header);
  const headers: Record<string, string> = {};

  for (const line of lines.split('\r\n')) {
    const [key, value] = line.split(':', 2);

    if (key && value) {
      headers[key] = value;
    }
  }

  return { headers, body: data.slice(headerLength + 2) };
}
