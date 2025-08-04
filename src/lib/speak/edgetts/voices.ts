import { fetch } from '@tauri-apps/plugin-http';

import { SEC_MS_GEC_VERSION, TRUSTED_CLIENT_TOKEN, VOICE_HEADERS, baseUrl } from './constants';
import { generateSecMsGec } from './drm';

const voiceListUrl = new URL(`voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`, baseUrl);

export const contentCategories = [
  'Cartoon',
  'Conversation',
  'Copilot',
  'Dialect',
  'General',
  'News',
  'Novel',
  'Sports',
] as const;
export type ContentCategory = (typeof contentCategories)[number];

export const voicePersonalities = [
  'Approachable',
  'Authentic',
  'Authority',
  'Bright',
  'Caring',
  'Casual',
  'Cheerful',
  'Clear',
  'Comfort',
  'Confident',
  'Considerate',
  'Conversational',
  'Cute',
  'Expressive',
  'Friendly',
  'Honest',
  'Humorous',
  'Lively',
  'Passion',
  'Pleasant',
  'Positive',
  'Professional',
  'Rational',
  'Reliable',
  'Sincere',
  'Sunshine',
  'Warm',
] as const;
export type VoicePersonality = (typeof voicePersonalities)[number];

/** VoiceTag data. */
export type VoiceTag = {
  ContentCategories: ContentCategory[];
  VoicePersonalities: VoicePersonality[];
};

/** Voice data. */
export type Voice = {
  Name: string;
  ShortName: string;
  Gender: 'Female' | 'Male';
  Locale: string;
  SuggestedCodec: 'audio-24khz-48kbitrate-mono-mp3';
  FriendlyName: string;
  Status: 'GA';
  VoiceTag: VoiceTag;
};

const voices: Voice[] = [];

/**
 * List all available voices and their attributes.
 *
 * This pulls data from the URL used by Microsoft Edge to return a list of
 * all available voices.
 *
 * @returns A list of voices and their attributes.
 */
export const listVoices = async () => {
  if (voices.length === 0) {
    const url = new URL(voiceListUrl);
    url.searchParams.set('Sec-MS-GEC', await generateSecMsGec());
    url.searchParams.set('Sec-MS-GEC-Version', SEC_MS_GEC_VERSION);

    const resp = await fetch(url, {
      headers: VOICE_HEADERS,
    });

    const voiceList = (await resp.json()) as Voice[];

    for (const v of voiceList) {
      if (v.Gender === 'Female' && v.Locale.startsWith('zh-CN')) {
        voices.push(v);
      }
    }
  }

  return voices;
};
