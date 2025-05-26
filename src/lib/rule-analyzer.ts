export default class RuleAnalyzer {
  private queue; // 被处理字符串
  private pos = 0; // 当前处理到的位置
  private start = 0; // 当前处理字段的开始
  private startX = 0; // 当前规则的开始

  constructor(data: string) {
    this.queue = data;
  }

  /**
   * 从剩余字串中拉出一个字符串，直到但不包括匹配序列
   * @param seq 查找的字符串 **区分大小写**
   * @return 是否找到相应字段。
   */
  private consumeTo(seq: string) {
    this.start = this.pos;
    const offset = this.queue.indexOf(seq, this.pos);

    if (offset !== -1) {
      this.pos = offset;
      return true;
    }

    return false;
  }

  /**
   * 替换内嵌规则
   * @param fr 查找到内嵌规则时，用于解析的函数
   */
  innerRule(startStr: string, endStr: string, func: (arg: string) => string) {
    let st = '';

    // 拉取成功返回 true，ruleAnalyzes 里的字符序列索引变量 pos 后移相应位置；否则返回 false，且 isEmpty 为 true
    while (this.consumeTo(startStr)) {
      // 跳过开始字符串
      this.pos += startStr.length;
      // 记录consumeTo匹配位置
      const posPre = this.pos;

      if (this.consumeTo(endStr)) {
        // 压入内嵌规则前的内容，及内嵌规则解析得到的字符串
        const r = func(this.queue.substring(posPre, this.pos));
        st += `${this.queue.substring(this.startX, posPre - startStr.length)}${r}`;
        // 跳过结束字符串
        this.pos += endStr.length;
        // 记录下次规则起点
        this.startX = this.pos;
      }
    }

    if (this.startX === 0) {
      return this.queue;
    }

    st += this.queue.substring(this.startX);
    return st;
  }
}
