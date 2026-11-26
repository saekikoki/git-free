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
 *   - 構造化データ（JSON-LD）の書き方が壊れている
 *   - --require-site-url を付けたとき: 公開URLが未設定（確認用ビルド）のまま
 *
 * 【注意】表示するが止めない
 *   - 公開URLが未設定（確認用ビルド。検索エンジンに登録されない）
 *   - 会社情報・お問い合わせ先がサンプルのまま（src/content/company-profile.js）
 *   - 見出し（h1）が1ページに1つではない
 *   - サイト内リンクの末尾に「/」がない（転送が1回挟まる）
 *   - タイトルが同じページが複数ある、タイトルや説明文が長すぎる
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
const requireSiteUrl = process.argv.includes("--require-site-url");

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
const read = (f) => (fs.existsSync(path.join(distDir, f)) ? fs.readFileSync(path.join(distDir, f), "utf8") : "");

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
const noSlashLinks = new Set();
const h1Problems = [];

for (const file of htmlFiles) {
  const name = rel(file);
  const html = fs.readFileSync(file, "utf8");
  const isNoindexPage = /<meta[^>]*name="robots"[^>]*content="noindex"/.test(html);

  // タイトル・説明文
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1]?.trim();
  const desc = (html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/) || [])[1] || "";
  if (!title) errors.push(`${name}: <title> がありません`);
  else {
    titles.set(title, [...(titles.get(title) || []), name]);
    if (title.length > 60) warnings.push(`${name}: タイトルが長すぎます（${title.length}文字。検索結果で途中までしか表示されません）`);
  }
  if (!desc) errors.push(`${name}: 説明文（meta description）がありません`);
  else if (desc.length > 160) warnings.push(`${name}: 説明文が長すぎます（${desc.length}文字。160文字程度までが目安）`);

  // 見出し（h1）は1ページに1つ
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1 && !isNoindexPage) h1Problems.push(`${name}（${h1}個）`);

  // 構造化データの書き方
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      errors.push(`${name}: 構造化データ（JSON-LD）の書き方が壊れています`);
    }
  }

  // <img> の alt
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt="/.test(img)) errors.push(`${name}: alt のない画像があります → ${img.slice(0, 80)}`);
  }

  // リンク・読み込みファイル
  for (const m of html.matchAll(/<(a|link|script|img)\b[^>]*?\b(href|src)="([^"]+)"/g)) {
    const [, tag, attr, url] = m;
    if (url.startsWith("//")) { externalLinks.add(`https:${url}`); continue; }
    if (/^https?:\/\//.test(url)) {
      // 共有ボタン・地図・フォントなど、決まった外部サービスは一覧に出さない
      if (!/(maps\.google|google\.com\/maps|fonts\.g|twitter\.com\/intent|facebook\.com\/sharer|linkedin\.com\/sharing)/.test(url)) {
        externalLinks.add(url);
      }
      continue;
    }
    if (!url.startsWith("/")) continue; // mailto: tel: # など
    if (!existsInDist(url)) {
      errors.push(`${name}: ${attr === "src" ? "ファイルが見つかりません" : "リンク切れ"} → ${url}`);
      continue;
    }
    // 末尾に「/」がないサイト内リンク（ファイルへのリンクは除く）
    const p = url.split(/[?#]/)[0];
    if (tag === "a" && p !== "/" && !p.endsWith("/") && !path.extname(p)) noSlashLinks.add(`${url}（${name} など）`);
  }
}

// ---- 3. 公開URL・会社情報 ----
const home = read("index.html");
const isPreviewBuild = /<meta[^>]*name="robots"[^>]*content="noindex"/.test(home);
if (isPreviewBuild) {
  const msg = "公開URL（VITE_SITE_URL）が未設定の確認用ビルドです。全ページが検索エンジンに登録されない設定になっています。公開はデプロイスクリプト（deploy-lite.sh など）で行ってください。";
  if (requireSiteUrl) errors.push(msg);
  else warnings.push(msg);
}

const contact = read("contact/index.html");
const company = read("company/index.html");
if (contact.includes("info@example.com")) warnings.push("お問い合わせのメールアドレスが仮の info@example.com のままです（src/content/company-profile.js の email）。");
if (contact.includes("03-0000-0000")) warnings.push("お問い合わせの電話番号が仮の 03-0000-0000 のままです（src/content/company-profile.js の phone）。");
if (/サンプル/.test(company)) warnings.push("企業情報にサンプルの内容が残っています（src/content/company-profile.js と src/content/ja/company.js）。");

if (h1Problems.length) warnings.push(`見出し（h1）が1つではないページがあります: ${h1Problems.slice(0, 5).join(", ")}${h1Problems.length > 5 ? " ほか" : ""}`);
if (noSlashLinks.size) warnings.push(`末尾に「/」がないサイト内リンクがあります（転送が1回挟まります）: ${[...noSlashLinks].slice(0, 5).join(", ")}`);

for (const [title, files] of titles) {
  // 日本語ページと、その英語ページ（文言が同じもの）の組は問題ない
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
