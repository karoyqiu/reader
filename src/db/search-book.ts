import type { BookSourceType } from '@/db/book-source';

export type SearchBook = {
  bookUrl: string;
  /** 书源 */
  origin: string;
  originName: string;
  type?: BookSourceType;
  name: string;
  auth?: string;
  kind?: string;
  coverUrl?: string;
  intro?: string;
  wordCount?: string;
  latestChapterTitle?: string;
  /** 目录页Url (toc=table of Contents) */
  tocUrl?: string;
  time?: Date;
  variable?: string;
  originOrder?: number;
  chapterWordCountText?: string;
  chapterWordCount?: number;
  respondTime?: number;
};
