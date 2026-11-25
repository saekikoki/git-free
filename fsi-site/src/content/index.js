/**
 * content/index.js - 画面に表示する文言の入口
 *
 * 文言は言語ごとのフォルダに分けて置いている。
 *   src/content/ja/  … 日本語
 *   src/content/en/  … 英語
 *
 * 画面側では useContent() を呼ぶと、今の言語の文言がまとめて返ってくる。
 *   const t = useContent();
 *   t.company.hero.title  // 日本語ページなら「企業情報」、英語ページなら「Company」
 */
import { useLang } from "../i18n/lang";

import jaCommon from "./ja/common";
import jaHome from "./ja/home";
import jaCompany from "./ja/company";
import jaRecruit from "./ja/recruit";
import jaLegal from "./ja/legal";
import jaFaq from "./ja/faq";
import jaContact from "./ja/contact";
import jaSearch from "./ja/search";

import enCommon from "./en/common";
import enHome from "./en/home";
import enCompany from "./en/company";
import enRecruit from "./en/recruit";
import enLegal from "./en/legal";
import enFaq from "./en/faq";
import enContact from "./en/contact";
import enSearch from "./en/search";

const content = {
  ja: {
    common: jaCommon, home: jaHome, company: jaCompany, recruit: jaRecruit,
    legal: jaLegal, faq: jaFaq, contact: jaContact, search: jaSearch,
  },
  en: {
    common: enCommon, home: enHome, company: enCompany, recruit: enRecruit,
    legal: enLegal, faq: enFaq, contact: enContact, search: enSearch,
  },
};

/** 言語を指定して文言を取り出す（フックが使えない場所用） */
export function getContent(lang) {
  return content[lang] || content.ja;
}

/** 現在の言語の文言を返すフック */
export function useContent() {
  return getContent(useLang());
}
