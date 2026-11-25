/**
 * check.mjs - 廉価版を公開する前のチェック（npm run check:lite）
 *
 * npm run build:lite のあとに実行する。dist-lite/ の中身を調べて、次を報告する。
 *
 * 【エラー】見つかると終了コード 1 で止まる（デプロイスクリプトもここで止まる）
 *   - 必要なファイルがない（index.html / 404.html / sitemap.xml / robots.txt / feed.xml / ogp.png）
 *   - サイト内のリンク切れ（href="/..." の先のページやファイルがない）
 *   - 画像・CSS・JS の付け忘れ（src="/..." の先のファイルがない）
 *   - <img> に alt（画像の説明）がない
 *   - ページにタイトルか説明文（description）がない
 *
 * 【注意】表示するが止めない
 *   - 公開URL（SITE_URL）が仮の example.com のまま
 *   - お問い合わせ先が仮の値（info@example.com / 03-0000-0000）のまま
 *   - タイトルが同じページが複数ある
 *   - 外部サイトへのリンク一覧（リンク先が正しいかは目で確認してください）
 *
 * --strict を付けると、【注意】もエラーとして扱う。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const distDir = path.join(rootDir, "dist-lite");
const strict = process.argv.includes("--strict");

const errors = [];
const warnings = [];

if (!fs.existsSync(distDir)) {
  console.error("[check] dist-lite/ がありません。先に npm run build:lite を実行してください。");
  process.exit(1);
}

// ---- 1. 必要なファイル ----
for (const f of ["index.html", "404.html", "sitemap.xml", "robots.txt", "feed.xml", "en/feed.xml", "ogp.png", "favicon.svg"]) {
  if (!fs.existsSync(path.join(distDir, f))) errors.push(`必要なファイルがありません: dist-lite/${f}`);
}

// ---- 2. HTML を全部読む ----
function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(p) : [p];
  });
}
const htmlFiles = listFiles(distDir).filter((f) => f.endsWith(".html"));
const rel = (f) => path.relative(distDir, f).replace(/\\/g, "/");

/** サイト内のパスが、dist-lite の中のファイルに対応するか */
function existsInDist(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (clean === "" || clean === "/") return true;
  const target = path.join(distDir, clean);
  if (path.extname(clean)) return fs.existsSync(target);
  return fs.existsSync(path.join(target, "index.html"));
}

const titles = new Map();
const externalLinks = new Set();

for (const file of htmlFiles) {
  const name = rel(file);
  const html = fs.readFileSync(file, "utf8");

  // タイトル・説明文
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1]?.trim();
  if (!title) errors.push(`${name}: <title> がありません`);
  else titles.set(title, [...(titles.get(title) || []), name]);
  if (!/<meta[^>]*name="description"[^>]*content="[^"]+"/.test(html)) errors.push(`${name}: 説明文（meta description）がありません`);

  // <img> の alt
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt="/.test(img)) errors.push(`${name}: alt のない画像があります → ${img.slice(0, 80)}`);
  }

  // リンク・読み込みファイル
  for (const m of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const [, attr, url] = m;
    if (url.startsWith("//")) { externalLinks.add(`https:${url}`); continue; }
    if (/^https?:\/\//.test(url)) {
      // SITE_URL（自分のサイト）へのリンクはサイト内として扱わない（canonical など）
      if (!/(maps\.google|google\.com\/maps|fonts\.g|twitter\.com\/intent|facebook\.com\/sharer|linkedin\.com\/sharing)/.test(url)) {
        externalLinks.add(url);
      }
      continue;
    }
    if (!url.startsWith("/")) continue; // mailto: tel: # など
    if (!existsInDist(url)) {
      errors.push(`${name}: ${attr === "src" ? "ファイルが見つかりません" : "リンク切れ"} → ${url}`);
    }
  }
}

// ---- 3. 仮の値のまま残っていないか ----
const home = fs.existsSync(path.join(distDir, "index.html")) ? fs.readFileSync(path.join(distDir, "index.html"), "utf8") : "";
const contact = fs.existsSync(path.join(distDir, "contact/index.html"))
  ? fs.readFileSync(path.join(distDir, "contact/index.html"), "utf8")
  : "";
if (/https:\/\/www\.example\.com/.test(home)) {
  warnings.push("公開URL（SITE_URL）が仮の https://www.example.com のままです。.env.lite の VITE_SITE_URL を設定するか、deploy-lite.sh でデプロイしてください。");
}
if (contact.includes("info@example.com")) warnings.push("お問い合わせのメールアドレスが仮の info@example.com のままです（src/editions/lite/config.js の CONTACT_EMAIL）。");
if (contact.includes("03-0000-0000")) warnings.push("お問い合わせの電話番号が仮の 03-0000-0000 のままです（src/editions/lite/config.js の CONTACT_PHONE）。");

for (const [title, files] of titles) {
  // 日本語ページと、その英語ページ（英語版の記事がなく日本語のまま表示するもの）の組は問題ない
  const isLangPair = files.length === 2 && files.some((f) => files.includes(`en/${f}`));
  if (files.length > 1 && !isLangPair) {
    warnings.push(`同じタイトルのページが ${files.length} 件あります「${title}」: ${files.join(", ")}`);
  }
}

// ---- 結果 ----
// 自分のサイトの URL（canonical・hreflang など）は外部リンク一覧から除く
const siteUrl = (home.match(/<link[^>]*rel="canonical"[^>]*href="(https?:\/\/[^/"]+)/) || [])[1];
const externals = [...externalLinks].filter((u) => !siteUrl || !u.startsWith(siteUrl)).sort();

console.log(`\n[check] ${htmlFiles.length} 個の HTML を確認しました`);
if (externals.length) {
  console.log(`\n[check] 外部サイトへのリンク（${externals.length} 件。リンク先が正しいか確認してください）`);
  for (const u of externals) console.log(`  - ${u}`);
}
if (warnings.length) {
  console.log(`\n[check] 注意（${warnings.length} 件）`);
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (errors.length) {
  console.log(`\n[check] エラー（${errors.length} 件）`);
  for (const e of errors) console.log(`  ✗ ${e}`);
}

const failed = errors.length > 0 || (strict && warnings.length > 0);
console.log(failed ? "\n[check] NG: 上のエラーを直してから公開してください。\n" : "\n[check] OK: 公開できる状態です。\n");
process.exit(failed ? 1 : 0);
