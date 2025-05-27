import BaseBook from './base-book';

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

export default class Book extends BaseBook {
  // 目录页Url (toc=table of Contents)
  tocUrl = '';
  // 书源URL(默认BookType.local)
  origin: string = BookType.LocalTag;
  //书源名称 or 本地书籍文件名
  originName = '';
  // 分类信息(用户修改)
  customTag?: string;
  // 封面Url(书源获取)
  coverUrl?: string;
  // 封面Url(用户修改)
  customCoverUrl?: string;
  // 简介内容(书源获取)
  intro?: string;
  // 简介内容(用户修改)
  customIntro?: string;
  // 自定义字符集名称(仅适用于本地书籍)
  charset?: string;
  // 类型,详见BookType
  type: BookType = BookType.Text;
  // 自定义分组索引号
  group = 0;
  // 最新章节标题
  latestChapterTitle?: string;
  // 最新章节标题更新时间
  latestChapterTime = new Date();
  // 最近一次更新书籍信息的时间
  lastCheckTime = new Date();
  // 最近一次发现新章节的数量
  lastCheckCount = 0;
  // 书籍目录总数
  totalChapterNum = 0;
  // 当前章节名称
  durChapterTitle?: string;
  // 当前章节索引
  durChapterIndex = 0;
  // 当前阅读的进度(首行字符的索引位置)
  durChapterPos = 0;
  // 最近一次阅读书籍的时间(打开正文的时间)
  durChapterTime = new Date();
  // 刷新书架时更新书籍信息
  canUpdate = true;
  // 手动排序
  order = 0;
  //书源排序
  originOrder = 0;
  //同步时间
  syncTime = 0;
}
