/**
 * searchIndex.js - サイト内検索の「索引」と検索処理
 *
 * サーバーがないので、検索はすべてブラウザの中で行う。
 * 索引は次のものから作る（どれもビルド時にサイトへ組み込まれている）。
 *   - 各ページの文言（src/content/{ja,en}/*.js）
 *   - 事業内容・導入事例・募集職種（1件ずつ別の結果として出す）
 *   - ニュース・コラム（本文は検索ページを開いたときに読み込む）
 * 文言や記事を更新すると、次のビルドで索引も自動で更新される。
 */
import { getContent } from "../../content";
import { getNewsListSync, getNewsBodySync, loadAllNewsBodies } from "@edition/dataSource";
import { FEATURES } from "@edition/config";
import { localizePath } from "../../i18n/lang";
import { localizeNews, newsPath } from "../news/newsUtils";

// 索引に入れない項目（アイコンや色の指定など、文章ではないもの）
const SKIP_KEYS = new Set(["icon", "color", "initial", "mapQuery", "id", "step", "slug", "relatedCases", "service", "employmentType", "salary", "datePosted"]);

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

const KINDS = () => ["news", ...(FEATURES.columns ? ["columns"] : [])];

/** 記事の本文をすべて読み込む（検索ページを開いたときに呼ぶ） */
export function prepareSearch(lang) {
  if (!loadAllNewsBodies) return Promise.resolve();
  return Promise.all(KINDS().map((kind) => loadAllNewsBodies(kind, lang)));
}

/** 言語ごとの索引を作る */
export function getSearchIndex(lang) {
  const c = getContent(lang);
  const names = c.search.pages;
  const text = (v) => collectText(v).join(" ");

  const pages = [
    { key: "home", path: "/", value: c.home },
    { key: "company", path: "/company", value: c.company },
    { key: "recruit", path: "/recruit", value: { ...c.recruit, jobs: { ...c.recruit.jobs, items: [] } } },
    { key: "faq", path: "/faq", value: c.faq },
    { key: "contact", path: "/contact", value: c.contact },
    { key: "privacy", path: "/privacy", value: c.legal.privacy },
    { key: "terms", path: "/terms", value: c.legal.terms },
  ].map((p) => ({ type: "page", title: names[p.key], url: localizePath(p.path, lang), text: text(p.value) }));

  const services = c.services.items.map((s) => ({
    type: "service", title: s.title, url: localizePath(`/services/${s.slug}`, lang), text: text(s),
  }));
  const cases = c.cases.items.map((cs) => ({
    type: "case", title: cs.title, url: localizePath(`/cases/${cs.slug}`, lang), text: text(cs),
  }));
  const jobs = c.recruit.jobs.items.map((j) => ({
    type: "job", title: j.title, url: localizePath(`/recruit/jobs/${j.slug}`, lang), text: text(j),
  }));

  const articles = getNewsListSync
    ? KINDS().flatMap((kind) =>
        getNewsListSync(kind).map((item) => {
          const n = localizeNews(item, lang);
          const body = getNewsBodySync(item.SK, kind, lang);
          return {
            type: kind,
            title: n.title,
            url: newsPath(item, lang, kind),
            date: n.publishedAt,
            text: `${n.summary || ""} ${body?.text || n.excerpt || ""}`,
          };
        })
      )
    : [];

  return [...pages, ...services, ...cases, ...jobs, ...articles].map((d) => ({
    ...d,
    _title: normalize(d.title),
    _text: normalize(d.text),
  }));
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
