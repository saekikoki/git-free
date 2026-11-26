/**
 * content/index.js - 画面に表示する文言の入口
 *
 * 文言は言語ごとのフォルダに分けて置いている。
 *   src/content/ja/  … 日本語
 *   src/content/en/  … 英語
 *   src/content/company-profile.js … 会社の基本情報（社名・住所・連絡先など。両方の言語で共通）
 *
 * 画面側では useContent() を呼ぶと、今の言語の文言がまとめて返ってくる。
 *   const t = useContent();
 *   t.company.hero.title  // 日本語ページなら「企業情報」、英語ページなら「Company」
 *
 * 表示を速くするため、文言は「必要になったときに読み込む」。
 *   - common（ヘッダー・フッターなど）と company-profile … 最初から読み込む
 *   - それ以外（home / company / recruit など）… そのページを開くときに読み込む
 *     どのページでどの文言を使うかは src/editions/lite/routes.js の content に書く。
 * 新しい文言ファイルを作ったら、下の CONTENT_NAMES に名前を足すこと。
 */
import { useLang } from "../i18n/lang";
import profile from "./company-profile";
import jaCommon from "./ja/common";
import enCommon from "./en/common";

// 必要になったときに読み込む文言ファイル（ファイル名から .js を除いたもの）
export const CONTENT_NAMES = ["home", "company", "recruit", "legal", "faq", "contact", "search", "services", "cases"];

// ビルド時に ja/・en/ のファイルを探して、ファイルごとに分けて出力する（パターンは書き換えないこと）
const LOADERS = import.meta.glob(["./ja/*.js", "./en/*.js", "!./ja/common.js", "!./en/common.js"], { import: "default" });

const store = {
  ja: { common: jaCommon, profile },
  en: { common: enCommon, profile },
};

/** 文言ファイルを読み込む。names を省略するとすべて読み込む */
export function loadContent(lang, names = CONTENT_NAMES) {
  const target = store[lang] || store.ja;
  const key = store[lang] ? lang : "ja";
  return Promise.all(
    names
      .filter((name) => !target[name])
      .map((name) => {
        const loader = LOADERS[`./${key}/${name}.js`];
        if (!loader) return Promise.reject(new Error(`文言ファイルが見つかりません: src/content/${key}/${name}.js`));
        return loader().then((mod) => { target[name] = mod; });
      })
  );
}

/** 指定した文言ファイルがすべて読み込み済みか */
export function hasContent(lang, names = CONTENT_NAMES) {
  const target = store[lang] || store.ja;
  return names.every((name) => target[name]);
}

/** 言語を指定して文言を取り出す（フックが使えない場所用）。読み込み前の文言は undefined */
export function getContent(lang) {
  return store[lang] || store.ja;
}

/** 現在の言語の文言を返すフック */
export function useContent() {
  return getContent(useLang());
}
