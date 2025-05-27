import { isNullish } from 'radashi';

import type { BookSource } from '@/db/book-source';
import { isDataUrl, isJson } from '@/lib/string-utils';

import type RuleData from './rule-data';

/**
 * 解析规则获取结果
 */
export default class AnalyzeRule {
  private ruleData;
  private source;
  private preUpdateJs = false;
  private content?: any;
  private baseUrl?: string;
  private redirectUrl?: URL;

  constructor(ruleData?: RuleData, source?: BookSource) {
    this.ruleData = ruleData;
    this.source = source;
  }

  setContent(content: any, baseUrl?: string) {
    if (isNullish(content)) {
      throw new Error('Content can not be null');
    }

    this.content = content;
    this.baseUrl = baseUrl;
  }

  setRedirectUrl(url: string) {
    if (!isDataUrl(url)) {
      try {
        this.redirectUrl = new URL(url);
      } catch (e) {}
    }
  }

  setRuleData(ruleData: RuleData) {
    this.ruleData = ruleData;
  }

  getElement(ruleStr: string) {
    if (!ruleStr) {
      return null;
    }
  }
}

enum Mode {
  XPath,
  Json,
  Default,
  Js,
  Regex,
}

const putPattern = /@put:(\\{[^}]+?\\})/i;

/**
 * 规则类
 */
class SourceRule {
  private rule;
  private mode;
  private putMap = new Map<string, string>();

  constructor(ruleStr: string, mode = Mode.Default) {
    this.mode = mode;
    const lowered = ruleStr.toLowerCase();

    if (lowered.startsWith('@@')) {
      this.rule = ruleStr.substring(2);
    } else if (lowered.startsWith('@xpath:')) {
      this.rule = ruleStr.substring(7);
      this.mode = Mode.XPath;
    } else if (lowered.startsWith('/')) {
      this.rule = ruleStr;
      this.mode = Mode.XPath;
    } else if (lowered.startsWith('@json:')) {
      this.rule = ruleStr.substring(6);
      this.mode = Mode.XPath;
    } else if (isJson(lowered) || lowered.startsWith('$.') || lowered.startsWith('$[')) {
      this.rule = ruleStr;
      this.mode = Mode.Json;
    } else {
      this.rule = ruleStr;
    }
  }

  private static splitPutRule(ruleStr: string, putMap: Map<String, String>) {
    const rule = ruleStr;
  }
}
