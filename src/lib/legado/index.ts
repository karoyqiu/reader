import { fetch } from '@tauri-apps/plugin-http';

import type { Book, BookChapter, BookProgress } from './book';

const baseUrl = new URL('http://192.168.0.100:1122');

type RequestParams = {
  path: string;
  method?: 'GET' | 'POST';
  query?: Record<string, string | number>;
  body?: BodyInit;
};

type ResultType<T> = {
  isSuccess: boolean;
  errorMsg: string;
  data: T;
};

const request = async <T>(req: RequestParams) => {
  const { path, method, query, body } = req;
  const url = new URL(path, baseUrl);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value.toString());
    }
  }

  const resp = await fetch(url, {
    method,
    body,
  });
  const result = (await resp.json()) as ResultType<T>;

  if (result.isSuccess) {
    return result.data;
  }

  throw new Error(result.errorMsg);
};

/** 获取所有书籍。 */
export const getBookshelf = () => request<Book[]>({ path: '/getBookshelf' });

/** 获取指定书籍的章节列表。 */
export const getChapterList = (bookUrl: string) =>
  request<BookChapter[]>({ path: '/getChapterList', query: { url: bookUrl } });

/** 获取指定书籍的第 `index` 章节的文本内容。 */
export const getBookContent = (bookUrl: string, index: number) =>
  request<string>({
    path: '/getBookContent',
    query: {
      url: bookUrl,
      index,
    },
  });

/** 保存书籍进度。 */
export const saveBookProgress = (progress: BookProgress) =>
  request<string>({
    path: '/saveBookProgress',
    method: 'POST',
    body: JSON.stringify(progress),
  });
