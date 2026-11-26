/**
 * newsLoader.js - 廉価版のニュース・コラム（Markdown ファイル）を読み込む
 *
 *   src/editions/lite/news/     … ニュースリリース（/news/...）
 *   src/editions/lite/columns/  … コラム（/columns/...）
 *
 * どちらのフォルダも書き方は同じ:
 *   2025-07-01-ai-division.md     … 日本語の記事（必須）
 *   2025-07-01-ai-division.en.md  … 同じ記事の英語版（任意。ない記事は英語ページを作らない）
 * ファイル名（.md を除いた部分）が記事のURLになる（/news/2025-07-01-ai-division/）。
 *
 * Markdown はビルド時に HTML に変換している（scripts/lite/markdown.mjs）。
 *   - 見出し・日付などの「一覧用の情報」は最初から読み込む（軽い）
 *   - 本文は、その記事を開いたときに初めて読み込む（全記事の本文を最初に送らない）
 */

// ---- ビルド時にフォルダの中の .md を探して取り込む（パターンは書き換えないこと） ----
const NEWS_META_JA = import.meta.glob(["./news/*.md", "!./news/*.en.md"], { query: "?meta", import: "default", eager: true });
const NEWS_META_EN = import.meta.glob("./news/*.en.md", { query: "?meta", import: "default", eager: true });
const NEWS_BODY_JA = import.meta.glob(["./news/*.md", "!./news/*.en.md"], { import: "default" });
const NEWS_BODY_EN = import.meta.glob("./news/*.en.md", { import: "default" });

const COLUMN_META_JA = import.meta.glob(["./columns/*.md", "!./columns/*.en.md"], { query: "?meta", import: "default", eager: true });
const COLUMN_META_EN = import.meta.glob("./columns/*.en.md", { query: "?meta", import: "default", eager: true });
const COLUMN_BODY_JA = import.meta.glob(["./columns/*.md", "!./columns/*.en.md"], { import: "default" });
const COLUMN_BODY_EN = import.meta.glob("./columns/*.en.md", { import: "default" });

// 書き方の間違い（英語版だけあって日本語版がない、など）。ビルド時に prerender.mjs が表示して止める
export const newsErrors = [];

const slugOf = (filePath) => filePath.split("/").pop().replace(/\.en\.md$|\.md$/, "");
const bySlug = (record) => Object.fromEntries(Object.entries(record).map(([p, v]) => [slugOf(p), v]));

function createCollection(dir, metaJa, metaEn, bodyJa, bodyEn) {
  const ja = bySlug(metaJa);
  const en = bySlug(metaEn);
  const loadersJa = bySlug(bodyJa);
  const loadersEn = bySlug(bodyEn);

  for (const slug of Object.keys(en)) {
    if (!ja[slug]) newsErrors.push(`src/editions/lite/${dir}/${slug}.en.md: 日本語版の ${slug}.md がありません`);
  }

  // 一覧用の情報。新しい順（同じ日付ならファイル名の逆順）
  const items = Object.entries(ja)
    .map(([slug, m]) => ({
      SK: slug,
      title: m.title,
      category: m.category,
      publishedAt: m.date,
      updated: m.updated,
      summary: m.summary,
      excerpt: m.excerpt,
      image: m.image,
      author: m.author,
      en: en[slug] ? { title: en[slug].title, summary: en[slug].summary, excerpt: en[slug].excerpt } : null,
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.SK.localeCompare(a.SK));

  const index = new Map(items.map((item) => [item.SK, item]));
  const bodies = new Map(); // "ja:slug" → { html, text }
  const pending = new Map();

  // 英語ページでも、英語版がない記事は日本語の本文を使う
  const bodyKey = (slug, lang) => `${lang === "en" && loadersEn[slug] ? "en" : "ja"}:${slug}`;

  function getBody(slug, lang) {
    return bodies.get(bodyKey(slug, lang)) || null;
  }

  function loadBody(slug, lang) {
    const key = bodyKey(slug, lang);
    if (bodies.has(key)) return Promise.resolve(bodies.get(key));
    if (pending.has(key)) return pending.get(key);
    const loader = (key.startsWith("en:") ? loadersEn : loadersJa)[slug];
    if (!loader) return Promise.reject(new Error("記事が見つかりません"));
    const promise = loader().then((body) => {
      bodies.set(key, body);
      pending.delete(key);
      return body;
    });
    pending.set(key, promise);
    return promise;
  }

  return {
    items,
    get: (slug) => index.get(slug) || null,
    getBody,
    loadBody,
    loadAll: (lang) => Promise.all(items.map((item) => loadBody(item.SK, lang))),
  };
}

export const collections = {
  news: createCollection("news", NEWS_META_JA, NEWS_META_EN, NEWS_BODY_JA, NEWS_BODY_EN),
  columns: createCollection("columns", COLUMN_META_JA, COLUMN_META_EN, COLUMN_BODY_JA, COLUMN_BODY_EN),
};

if (newsErrors.length && typeof window !== "undefined") {
  console.error("[ニュース・コラムの書き方に間違いがあります]\n" + newsErrors.join("\n"));
}
