/**
 * searchIndex.js - サイト内検索の「索引」と検索処理
 *
 * サーバーがないので、検索はすべてブラウザの中で行う。
 * 索引は次の2つから作る（どちらもビルド時にサイトへ組み込まれている）。
 *   - 各ページの文言（src/content/{ja,en}/*.js）
 *   - ニュース記事（src/editions/lite/news/*.md）
 * 文言やニュースを更新すると、次のビルドで索引も自動で更新される。
 */
import { getContent } from "../../content";
import { getNewsListSync } from "@edition/dataSource";
import { localizePath } from "../../i18n/lang";
import { localizeNews } from "../news/newsUtils";

// 索引に入れない項目（アイコンや色の指定など、文章ではないもの）
const SKIP_KEYS = new Set(["icon", "color", "initial", "mapQuery", "id", "step"]);

/** オブジェクトの中の文字列を全部つなげて1つの文章にする */
function collectText(value, out = []) {
  if (typeof value === "string") out.push(value.replace(/\n/g, " "));
  else if (Array.isArray(value)) value.forEach((v) => collectText(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) if (!SKIP_KEYS.has(k)) collectText(v, out);
  }
  return out;
}

/** 検索で比べやすいように文字をそろえる（全角英数→半角、大文字→小文字） */
export function normalize(text) {
  return String(text || "").normalize("NFKC").toLowerCase();
}

const cache = {};

/** 言語ごとの索引を作る（一度作ったら使い回す） */
export function getSearchIndex(lang) {
  if (cache[lang]) return cache[lang];
  const c = getContent(lang);
  const names = c.search.pages;

  const pages = [
    { key: "home", path: "/", text: collectText(c.home) },
    { key: "company", path: "/company", text: collectText(c.company) },
    { key: "recruit", path: "/recruit", text: collectText(c.recruit) },
    { key: "faq", path: "/faq", text: collectText(c.faq) },
    { key: "contact", path: "/contact", text: collectText(c.contact) },
    { key: "privacy", path: "/privacy", text: collectText(c.legal.privacy) },
    { key: "terms", path: "/terms", text: collectText(c.legal.terms) },
  ].map((p) => ({
    type: "page",
    title: names[p.key],
    url: localizePath(p.path, lang),
    text: p.text.join(" "),
  }));

  const news = (getNewsListSync ? getNewsListSync() : []).map((item) => {
    const n = localizeNews(item, lang);
    return {
      type: "news",
      title: n.title,
      url: localizePath(`/news/${n.SK}`, lang),
      date: n.publishedAt,
      text: `${n.summary || ""} ${n.content || ""}`,
    };
  });

  const docs = [...pages, ...news].map((d) => ({ ...d, _title: normalize(d.title), _text: normalize(d.text) }));
  cache[lang] = docs;
  return docs;
}

/**
 * 検索する。スペースで区切った言葉を「すべて含む」ものを返す。
 * 見出しに含まれるものほど上位に並べる。
 */
export function searchSite(query, lang) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  return getSearchIndex(lang)
    .map((doc) => {
      let score = 0;
      for (const w of words) {
        const inTitle = doc._title.includes(w);
        const inText = doc._text.includes(w);
        if (!inTitle && !inText) return null;
        score += (inTitle ? 10 : 0) + (inText ? 1 : 0);
      }
      return { ...doc, score, snippet: makeSnippet(doc.text, words) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(b.date || "").localeCompare(String(a.date || "")));
}

/** 最初に見つかった言葉の前後を切り出して、結果に表示する短い文章を作る */
function makeSnippet(text, words, radius = 50) {
  const norm = normalize(text);
  let pos = -1;
  for (const w of words) {
    const i = norm.indexOf(w);
    if (i !== -1 && (pos === -1 || i < pos)) pos = i;
  }
  if (pos === -1) return text.slice(0, radius * 2);
  const start = Math.max(0, pos - radius);
  const end = Math.min(text.length, pos + radius * 2);
  return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
}
