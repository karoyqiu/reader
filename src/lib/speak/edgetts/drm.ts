import { TRUSTED_CLIENT_TOKEN } from './constants';
import { toUtf8 } from './utils';

const WIN_EPOCH = 11644473600;
const S_TO_NS = 1e9;
let clockSkewSeconds = 0;

/** Compute the SHA256 hash and return the uppercased hex digest */
const sha256 = async (s: string) => {
  const bytes = toUtf8(s);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // 将缓冲区转换为字节数组
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // 将字节数组转换为十六进制字符串
  return hashHex.toUpperCase();
};

/**
 * Gets the current timestamp in Unix format with clock skew correction.
 *
 * @returns The current timestamp in Unix format with clock skew correction.
 */
const getUnixTimestamp = () => Math.round(Date.now() / 1000) + clockSkewSeconds;

/**
 * Generates the Sec-MS-GEC token value.
 *
 * This function generates a token value based on the current time in Windows file time format
 * adjusted for clock skew, and rounded down to the nearest 5 minutes. The token is then hashed
 * using SHA256 and returned as an uppercased hex digest.
 *
 * @returns The generated Sec-MS-GEC token value.
 */
export const generateSecMsGec = () => {
  // Get the current timestamp in Unix format with clock skew correction
  let ticks = getUnixTimestamp();

  // Switch to Windows file time epoch (1601-01-01 00:00:00 UTC)
  ticks += WIN_EPOCH;

  // Round down to the nearest 5 minutes (300 seconds)
  ticks -= ticks % 300;

  // Convert the ticks to 100-nanosecond intervals (Windows file time format)
  ticks *= S_TO_NS / 100;

  // Create the string to hash by concatenating the ticks and the trusted client token
  const strToHash = `${ticks.toFixed(0)}${TRUSTED_CLIENT_TOKEN}`;

  // Compute the SHA256 hash and return the uppercased hex digest
  return sha256(strToHash);
};
