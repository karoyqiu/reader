/**
 * 以二进制位来区分，可能一本书籍包含多个类型，每一位代表一个类型，数值为 2 的 n 次方
 * 以二进制位来区分，数据库查询更高效，数值 >=8 和老版本类型区分开
 */
export enum BookType {
  Text = 0x8,
  UpdateError = 0x10,
  Audio = 0x20,
  Image = 0x40,
  WebFile = 0x80,
  Local = 0x100,
  Archive = 0x200,
  NotShelf = 0x400,
  LocalTag = 'loc_book',
}

/** 书籍 */
export type Book = {
  /** 书籍名称(书源获取) */
  name: string;
  /** 作者名称(书源获取) */
  author: string;
  /** 详情页Url(本地书源存储完整文件路径) */
  bookUrl: string;
  /** 分类信息(书源获取) */
  kind?: string;
  /**字数 */
  wordCount?: string;
  /** 自定义书籍变量信息(用于书源规则检索书籍信息) */
  variable?: string;
  infoHtml?: string;
  tocHtml?: string;
  /** 目录页Url (toc=table of Contents) */
  tocUrl: string;
  /** 书源URL(默认BookType.local) */
  origin: string;
  /**书源名称 or 本地书籍文件名 */
  originName: string;
  /** 分类信息(用户修改) */
  customTag?: string;
  /** 封面Url(书源获取) */
  coverUrl?: string;
  /** 封面Url(用户修改) */
  customCoverUrl?: string;
  /** 简介内容(书源获取) */
  intro?: string;
  /** 简介内容(用户修改) */
  customIntro?: string;
  /** 自定义字符集名称(仅适用于本地书籍) */
  charset?: string;
  /** 类型,详见BookType */
  type: BookType;
  /** 自定义分组索引号 */
  group?: number;
  /** 最新章节标题 */
  latestChapterTitle?: string;
  /** 最新章节标题更新时间 */
  latestChapterTime?: number;
  /** 最近一次更新书籍信息的时间 */
  lastCheckTime?: number;
  /** 最近一次发现新章节的数量 */
  lastCheckCount?: number;
  /** 书籍目录总数 */
  totalChapterNum?: number;
  /** 当前章节名称 */
  durChapterTitle?: string;
  /** 当前章节索引 */
  durChapterIndex?: number;
  /** 当前阅读的进度(首行字符的索引位置) */
  durChapterPos?: number;
  /** 最近一次阅读书籍的时间(打开正文的时间) */
  durChapterTime?: number;
  /** 刷新书架时更新书籍信息 */
  canUpdate?: boolean;
  /** 手动排序 */
  order?: number;
  /** 书源排序 */
  originOrder?: number;
  /** 同步时间 */
  syncTime?: number;
};

/** 书籍章节 */
export type BookChapter = {
  /** 章节地址 */
  url?: string;
  /** 章节标题 */
  title?: string;
  /** 是否是卷名 */
  isVolume?: boolean;
  /** 用来拼接相对url */
  baseUrl?: string;
  /** 书籍地址 */
  bookUrl?: string;
  /** 章节序号 */
  index?: number;
  /** 是否VIP */
  isVip?: boolean;
  /** 是否已购买 */
  isPay?: boolean;
  /** 音频真实URL */
  resourceUrl?: string;
  /** 更新时间或其他章节附加信息 */
  tag?: string;
  /** 本章节字数 */
  wordCount?: string;
  /** 章节起始位置 */
  start?: number;
  /** 章节终止位置 */
  end?: number;
  /** EPUB书籍当前章节的fragmentId */
  startFragmentId?: string;
  /** EPUB书籍下一章节的fragmentId */
  endFragmentId?: string;
  /** 变量 */
  variable?: string;
};

/** 书籍进度 */
export type BookProgress = Pick<
  Book,
  'name' | 'author' | 'durChapterIndex' | 'durChapterPos' | 'durChapterTime' | 'durChapterTitle'
>;
