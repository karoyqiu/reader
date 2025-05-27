import type Book from '@/db/book';
import type { BookSource } from '@/db/book-source';
import type AnalyzeRule from '@/model/analyze-rule/analyze-rule';

export const analyzeBookInfo = (
  book: Book,
  body: string,
  analyzeRule: AnalyzeRule,
  bookSource: BookSource,
  baseUrl: string,
  redirectUrl: string,
  canRename: boolean,
) => {
  const infoRule = bookSource.getBookInfoRule();
};
