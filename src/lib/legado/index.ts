import type { Book } from './book';

const baseUrl = new URL('http://192.168.0.100:1122');

type RequestType = {
  path: string;
  query?: Record<string, string | number>;
};

type ResultType<T> = {
  isSuccess: boolean;
  errorMsg: string;
  data: T;
};

const get = async <T>(req: RequestType) => {
  const { path, query } = req;
  const url = new URL(path, baseUrl);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value.toString());
    }
  }

  const resp = await fetch(url);
  const result = (await resp.json()) as ResultType<T>;

  if (result.isSuccess) {
    return result.data;
  }

  throw new Error(result.errorMsg);
};

/** 获取所有书籍 */
export const getBookshelf = () => get<Book[]>({ path: '/getBookshelf' });

/** 获取指定图书的第 `index` 章节的文本内容。 */
export const getBookContent = (bookUrl: string, index: number) =>
  get<string>({
    path: '/getBookContent',
    query: {
      url: bookUrl,
      index,
    },
  });
