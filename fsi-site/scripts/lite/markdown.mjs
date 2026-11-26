/**
 * markdown.mjs - 廉価版のニュース・コラム（Markdown）を、ビルド時に HTML に変換する Vite プラグイン
 *
 * vite.config.js から読み込まれる。ブラウザでは動かない（変換に使う marked はブラウザに送らない）。
 *
 * 読み込み方は2通り（src/editions/lite/newsLoader.js が使う）:
 *   import meta from "./news/xxx.md?meta"  → 見出し・日付・カテゴリ・要約だけ（一覧に使う。軽い）
 *   import body from "./news/xxx.md"       → 本文の HTML と、検索用の飾りのない文章（記事を開いたときに読む）
 *
 * 書き方の間違い（title がない、日付の形式が違う、など）は、ビルドを止めてファイル名と内容を表示する。
 */
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 先頭の「---」で囲まれた部分を key: value として読み取る */
export function parseFrontMatter(raw) {
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
export function toPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * HTML 中のサイト内リンクの末尾に「/」を付け、外部リンクは新しいタブで開くようにする。
 *   href="/contact"      → href="/contact/"
 *   href="https://..."   → target="_blank" rel="noopener noreferrer" を付ける
 */
function fixLinks(html) {
  return html.replace(/<a href="([^"]*)"/g, (all, href) => {
    if (/^https?:\/\//.test(href)) return `<a href="${href}" target="_blank" rel="noopener noreferrer"`;
    if (!href.startsWith("/") || href.startsWith("//")) return all;
    const [, p, rest] = href.match(/^([^?#]*)(.*)$/);
    const last = p.split("/").pop();
    const fixed = p.endsWith("/") || /\.[a-z0-9]+$/i.test(last) ? p : `${p}/`;
    return `<a href="${fixed}${rest}"`;
  });
}

/** 画像に読み込みの遅延と非同期デコードを付ける（表示速度の改善） */
function lazyImages(html) {
  return html.replace(/<img /g, '<img loading="lazy" decoding="async" ');
}

/**
 * Markdown ファイル1つを変換する。間違いがあれば Error を投げる。
 * @returns {{ meta: object, html: string, text: string }}
 */
export function compileMarkdown(raw, filePath) {
  const fileName = path.basename(filePath);
  const where = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
  const isEn = fileName.endsWith(".en.md");
  const slug = fileName.replace(/\.en\.md$|\.md$/, "");

  if (!SLUG_RE.test(slug)) {
    throw new Error(`${where}: ファイル名には半角英小文字・数字・ハイフン(-)だけを使ってください`);
  }
  const { meta, body } = parseFrontMatter(raw);
  if (!meta) {
    throw new Error(`${where}: 先頭に「---」で囲んだ設定（title / category / date）がありません`);
  }
  const required = isEn ? ["title"] : ["title", "category", "date"];
  const missing = required.filter((k) => !meta[k]);
  if (missing.length) throw new Error(`${where}: ${missing.join(", ")} がありません`);
  for (const key of ["date", "updated"]) {
    if (meta[key] && !DATE_RE.test(meta[key])) {
      throw new Error(`${where}: ${key} は 2025-07-01 の形式で書いてください（今: ${meta[key]}）`);
    }
  }

  const text = toPlainText(body);
  const html = lazyImages(fixLinks(marked.parse(body, { gfm: true, breaks: true, async: false })));
  // 一覧・検索結果・SNS 用の短い説明。summary がなければ本文の先頭から作る
  const excerpt = meta.summary || (text.length > 120 ? `${text.slice(0, 120)}…` : text);

  return {
    meta: {
      title: meta.title,
      category: meta.category || "",
      date: meta.date || "",
      updated: meta.updated || "",
      summary: meta.summary || "",
      excerpt,
      image: meta.image || "",
      author: meta.author || "",
    },
    html,
    text,
  };
}

/** Vite プラグイン本体 */
export default function liteMarkdownPlugin() {
  return {
    name: "lite-markdown",
    enforce: "pre",
    load(id) {
      const [file, query = ""] = id.split("?");
      if (!file.endsWith(".md")) return null;
      const raw = fs.readFileSync(file, "utf8");
      let result;
      try {
        result = compileMarkdown(raw, file);
      } catch (err) {
        this.error(`\n[ニュース・コラムの書き方に間違いがあります]\n  ${err.message}\n`);
      }
      const data = /(^|&)meta(&|$)/.test(query) ? result.meta : { html: result.html, text: result.text };
      return `export default ${JSON.stringify(data)};`;
    },
  };
}
