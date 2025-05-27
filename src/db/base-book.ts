import RuleData from '@/model/analyze-rule/rule-data';

export default class BaseBook extends RuleData {
  // 书籍名称(书源获取)
  name = '';
  // 作者名称(书源获取)
  author = '';
  // 详情页Url(本地书源存储完整文件路径)
  bookUrl = '';
  // 分类信息(书源获取)
  kind?: string;
  //字数
  wordCount?: string;
  // 自定义书籍变量信息(用于书源规则检索书籍信息)
  variable?: string;
  infoHtml?: string;
  tocHtml?: string;

  getKindList() {
    const kindList: string[] = [];

    if (this.wordCount) {
      kindList.push(this.wordCount.toString());
    }

    if (this.kind) {
      for (const k of this.kind.split(/[,\s]/)) {
        const s = k.trim();

        if (s) {
          kindList.push(s);
        }
      }
    }

    return kindList;
  }
}
