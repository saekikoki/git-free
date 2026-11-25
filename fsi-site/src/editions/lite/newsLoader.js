/**
 * newsLoader.js - 廉価版のニュース（Markdownファイル）を読み込む
 *
 * src/editions/lite/news/ にある .md ファイルを、ビルド時にまとめて取り込む。
 *   2025-07-01-ai-division.md     … 日本語の記事（必須）
 *   2025-07-01-ai-division.en.md  … 同じ記事の英語版（任意）
 *
 * ファイル名（.md を除いた部分）が記事のURLになる。
 *   2025-07-01-ai-division.md → /news/2025-07-01-ai-division
 *
 * 記事の先頭には「---」で囲んだ設定（フロントマター）を書く。
 *   ---
 *   title: 見出し
 *   category: お知らせ
 *   date: 2025-07-01
 *   summary: 一覧や検索結果に出す短い説明（任意）
 *   ---
 *   ここから本文（Markdown）
 */
import { marked } from "marked";

// ビルド時に news フォルダの .md をすべて文字列として読み込む
const files = import.meta.glob("./news/*.md", { query: "?raw", import: "default", eager: true });

// 書き方の間違いはここに集める（ビルド時に scripts/lite/prerender.mjs が表示して止める）
export const newsErrors = [];

const REQUIRED = ["title", "category", "date"];
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 先頭の「---」で囲まれた部分を key: value として読み取る */
function parseFrontMatter(raw) {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: null, body: text };
  const meta = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // "..." や '...' で囲んだ値は外側の引用符を外す
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

/** Markdown の本文から、説明文や検索に使う「飾りのない文章」を作る */
function toPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function render(body) {
  // 本文は自社で書く Markdown なので、HTML への変換結果をそのまま表示する
  return marked.parse(body, { gfm: true, breaks: true, async: false });
}

function buildArticles() {
  const ja = {};
  const en = {};

  for (const [filePath, raw] of Object.entries(files)) {
    const fileName = filePath.split("/").pop();
    const isEn = fileName.endsWith(".en.md");
    const slug = fileName.replace(/\.en\.md$|\.md$/, "");
    const { meta, body } = parseFrontMatter(raw);
    const where = `src/editions/lite/news/${fileName}`;

    if (!SLUG_RE.test(slug)) {
      newsErrors.push(`${where}: ファイル名には半角英小文字・数字・ハイフン(-)だけを使ってください`);
      continue;
    }
    if (!meta) {
      newsErrors.push(`${where}: 先頭に「---」で囲んだ設定（title / category / date）がありません`);
      continue;
    }

    const content = toPlainText(body);
    if (isEn) {
      if (!meta.title) {
        newsErrors.push(`${where}: title がありません`);
        continue;
      }
      en[slug] = { title: meta.title, summary: meta.summary || "", html: render(body), content };
      continue;
    }

    const missing = REQUIRED.filter((k) => !meta[k]);
    if (missing.length) {
      newsErrors.push(`${where}: ${missing.join(", ")} がありません`);
      continue;
    }
    if (!DATE_RE.test(meta.date)) {
      newsErrors.push(`${where}: date は 2025-07-01 の形式で書いてください（今: ${meta.date}）`);
      continue;
    }

    ja[slug] = {
      SK: slug,
      title: meta.title,
      category: meta.category,
      publishedAt: meta.date,
      summary: meta.summary || "",
      image: meta.image || "",
      html: render(body),
      content,
    };
  }

  // 英語版だけあって日本語版がないファイルは間違いとして知らせる
  for (const slug of Object.keys(en)) {
    if (!ja[slug]) newsErrors.push(`src/editions/lite/news/${slug}.en.md: 日本語版の ${slug}.md がありません`);
  }

  return Object.values(ja)
    .map((item) => ({ ...item, en: en[item.SK] || null }))
    // 新しい順。同じ日付ならファイル名の逆順
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.SK.localeCompare(a.SK));
}

export const articles = buildArticles();

if (newsErrors.length && typeof window !== "undefined") {
  console.error("[ニュースの書き方に間違いがあります]\n" + newsErrors.join("\n"));
}
