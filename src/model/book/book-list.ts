import Book from '@/db/book';
import type { BookSource } from '@/db/book-source';
import type { SearchBook } from '@/db/search-book';
import { getAbsoluteUrl } from '@/lib/network-utils';
import type UrlAnalyzer from '@/lib/url-analyzer';
import AnalyzeRule from '@/model/analyze-rule/analyze-rule';
import type RuleData from '@/model/analyze-rule/rule-data';

export const analyzeBookList = (
  bookSource: BookSource,
  ruleData: RuleData,
  urlAnalyzer: UrlAnalyzer,
  baseUrl: string,
  body: string,
  isSearch = true,
  isRedirect = false,
  filter?: (name: string, author: string) => boolean,
  shouldBreak?: (size: number) => boolean,
) => {
  const bookList: SearchBook[] = [];

  const analyzeRule = new AnalyzeRule(ruleData, bookSource);
  analyzeRule.setContent(body, baseUrl);
  analyzeRule.setRedirectUrl(baseUrl);

  if (isSearch && bookSource.bookUrlPattern) {
    if (baseUrl.match(bookSource.bookUrlPattern)) {
      console.debug(bookSource.bookSourceUrl, '≡链接为详情页');
    }
  }

  return bookList;
};

const getInfoItem = (
  bookSource: BookSource,
  analyzeRule: AnalyzeRule,
  analyzeUrl: UrlAnalyzer,
  body: string,
  baseUrl: string,
  variable?: string,
  isRedirect?: Boolean,
  filter?: (name: string, author: string) => boolean,
) => {
  const book = new Book();
  book.variable = variable;
  book.bookUrl = isRedirect ? baseUrl : getAbsoluteUrl(analyzeUrl.url.toString()).toString();
  book.origin = bookSource.bookSourceUrl;
  book.originName = bookSource.bookSourceName;
  book.originOrder = bookSource.customOrder ?? 0;
  book.type = bookSource.getBookType();
  analyzeRule.setRuleData(book);
};
