import { fetch } from '@tauri-apps/plugin-http';
import { isNullish } from 'radashi';

import type { BookSource } from '@/db';
import { getHeaderMap } from '@/db/book-source';
import { getAbsoluteUrl, getBaseUrl } from '@/lib/network-utils';
import RuleAnalyzer from '@/lib/rule-analyzer';

const paramPattern = /\s*,\s*(?=\{)/;
const pagePattern = /<(.*?)>/;

type UrlAnalyzerOptions = {
  url: string | URL;
  source?: BookSource;
  baseUrl?: string;
  page?: number;
  key?: string;
};

type UrlOptions = {
  method?: string;
  charset?: string;
  headers?: string;
  body?: string;
  origin?: string;
  retry?: number;
  type?: string;
  js?: string;
};

export default class UrlAnalyzer {
  private options;
  private ruleUrl: string;
  private urlOptions: UrlOptions = {};
  private headers: Record<string, string>;

  constructor(options: UrlAnalyzerOptions) {
    this.options = options;
    this.ruleUrl = options.url.toString();
    this.headers = getHeaderMap(options.source?.header);
    this.analyseJs();
    this.replaceKeyPageJs();
    this.analyseUrl();
  }

  get url() {
    return this.options.url;
  }

  /**
   * 执行 @js、<js></js>
   */
  private analyseJs() {}

  /**
   * 替换关键字、页数、JS
   */
  private replaceKeyPageJs() {
    // js
    if (this.ruleUrl.includes('{{') && this.ruleUrl.includes('}}')) {
      const analyzer = new RuleAnalyzer(this.ruleUrl);
      const url = analyzer.innerRule('{{', '}}', (arg) => this.evalJs(arg));

      if (url) {
        this.ruleUrl = url;
      }
    }

    // page
    if (!isNullish(this.options.page)) {
      //const matches = pagePattern.exec(this.ruleUrl);
    }
  }

  /**
   * 解析 Url
   */
  private analyseUrl() {
    // replaceKeyPageJs 已经替换掉额外内容，此处 url 是基础形式，可以直接切首个‘,’之前字符串。
    const urlMatches = paramPattern.exec(this.ruleUrl);
    const urlWithoutOptions = urlMatches
      ? this.ruleUrl.substring(0, urlMatches.index)
      : this.ruleUrl;
    this.options.url = getAbsoluteUrl(urlWithoutOptions, this.options.baseUrl);
    this.options.baseUrl = getBaseUrl(this.options.url)?.toString();

    if (urlMatches) {
      this.urlOptions = JSON.parse(urlMatches[1]) as UrlOptions;
      this.headers = {
        ...this.headers,
        ...getHeaderMap(this.urlOptions.headers),
      };
    }
  }

  private evalJs(js: string, result?: unknown) {
    const func = new Function(
      'return function(baseUrl,page,key,source,result) { return `${' + js + '}`}',
    )();
    return func(
      this.options.baseUrl,
      this.options.page,
      this.options.key,
      this.options.source,
      result,
    ) as string;
  }

  getResponse() {
    return fetch(this.options.url, {
      // proxy: {
      //   all: 'http://127.0.0.1:8888',
      // },
      method: this.urlOptions.method ?? 'GET',
      headers: this.headers,
      referrer: this.headers.referrer ?? this.headers.referer,
    });
  }
}
