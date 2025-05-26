import { z } from 'zod/v4-mini';

/** 类型，0 文本，1 音频, 2 图片, 3 文件（指的是类似知轩藏书只提供下载的网站） */
enum BookSourceType {
  /** 文本 */
  Text,
  /** 音频 */
  Audio,
  /** 图片 */
  Image,
  /** 文件（指的是类似知轩藏书只提供下载的网站） */
  File,
}

/**
 * 书籍列表规则
 */
type BookListRule = {
  bookList?: String;
  name?: String;
  author?: String;
  intro?: String;
  kind?: String;
  lastChapter?: String;
  updateTime?: String;
  bookUrl?: String;
  coverUrl?: String;
  wordCount?: String;
};

/**
 * 发现结果规则
 */
type ExploreRule = BookListRule;

/**
 * 搜索结果处理规则
 */
type SearchRule = BookListRule & {
  checkKeyWord?: string;
};

/**
 * 书籍详情页规则
 */
type BookInfoRule = {
  init?: string;
  name?: string;
  author?: string;
  intro?: string;
  kind?: string;
  lastChapter?: string;
  updateTime?: string;
  coverUrl?: string;
  tocUrl?: string;
  wordCount?: string;
  canReName?: string;
  downloadUrls?: string;
};

/**
 * 目录页规则
 */
type TocRule = {
  preUpdateJs?: string;
  chapterList?: string;
  chapterName?: string;
  chapterUrl?: string;
  formatJs?: string;
  isVolume?: string;
  isVip?: string;
  isPay?: string;
  updateTime?: string;
  nextTocUrl?: string;
};

/**
 * 正文页规则
 */
type ContentRule = {
  content?: string;
  // 有些网站只能在正文中获取标题
  title?: string;
  nextContentUrl?: string;
  webJs?: string;
  sourceRegex?: string;
  replaceRegex?: string; // 替换规则
  imageStyle?: string; // 默认大小居中，`FULL` 最大宽度
  imageDecode?: string; // 图片 bytes 二次解密 js, 返回解密后的 bytes
  payAction?: string; // 购买操作，js 或者包含 {{js}} 的 url
};

/**
 * 段评规则
 */
type ReviewRule = {
  reviewUrl?: string; // 段评URL
  avatarRule?: string; // 段评发布者头像
  contentRule?: string; // 段评内容
  postTimeRule?: string; // 段评发布时间
  reviewQuoteUrl?: string; // 获取段评回复URL

  // 这些功能将在以上功能完成以后实现
  voteUpUrl?: string; // 点赞URL
  voteDownUrl?: string; // 点踩URL
  postReviewUrl?: string; // 发送回复URL
  postQuoteUrl?: string; // 发送回复段评URL
  deleteUrl?: string; // 删除段评URL
};

/**
 * 书源
 */
export type BookSource = {
  // 地址，包括 http/https
  bookSourceUrl: string;
  // 名称
  bookSourceName: string;
  // 分组
  bookSourceGroup?: string;
  // 类型
  bookSourceType: BookSourceType;
  // 详情页url正则
  bookUrlPattern?: string;
  // 手动排序编号
  customOrder: number;
  // 是否启用
  enabled: boolean;
  // 启用发现
  enabledExplore: boolean;
  // js库
  jsLib?: string;
  // 启用okhttp CookieJAr 自动保存每次请求的cookie
  enabledCookieJar?: boolean;
  // 并发率
  concurrentRate?: string;
  // 请求头
  header?: string;
  // 登录地址
  loginUrl?: string;
  // 登录UI
  loginUi?: string;
  // 登录检测js
  loginCheckJs?: string;
  // 封面解密js
  coverDecodeJs?: string;
  // 注释
  bookSourceComment?: string;
  // 自定义变量说明
  variableComment?: string;
  // 最后更新时间，用于排序
  lastUpdateTime: number;
  // 响应时间，用于排序
  respondTime: number;
  // 智能排序的权重
  weight: number;
  // 发现url
  exploreUrl?: string;
  // 发现筛选规则
  exploreScreen?: string;
  // 发现规则
  ruleExplore?: ExploreRule;
  // 搜索url
  searchUrl?: string;
  // 搜索规则
  ruleSearch?: SearchRule;
  // 书籍信息页规则
  ruleBookInfo?: BookInfoRule;
  // 目录页规则
  ruleToc?: TocRule;
  // 正文页规则
  ruleContent?: ContentRule;
  // 段评规则
  ruleReview?: ReviewRule;
};

const headerSchema = z.record(z.string().check(z.toLowerCase()), z.string());

export const getHeaderMap = (header: string | undefined | null) => {
  if (header) {
    try {
      const obj = JSON.parse(header);
      return headerSchema.parse(obj);
    } catch (e) {}
  }

  return {};
};
