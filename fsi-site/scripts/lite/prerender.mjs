/**
 * prerender.mjs - 廉価版のページを事前に HTML 化する（npm run build:lite の最後に実行される）
 *
 * 前提: 次の2つのビルドが終わっていること（package.json の build:lite が順に実行する）
 *   1. vite build --mode lite                       → dist-lite/（ブラウザ用の JS・CSS）
 *   2. vite build --mode lite --ssr ...entry-server  → .ssr-lite/（HTML を作るための JS）
 *
 * このスクリプトがすること:
 *   - ページごとの HTML（dist-lite/company/index.html など）を作る
 *     そのページで使う JS を先に読み込む指定（modulepreload）も入れる（表示速度の改善）
 *   - 存在しないURL用の dist-lite/404.html を作る
 *   - sitemap.xml（検索エンジン向けのページ一覧。更新日 lastmod つき）と robots.txt を作る
 *   - RSS フィード（dist-lite/feed.xml と dist-lite/en/feed.xml）を作る
 *
 * 公開URL（VITE_SITE_URL）が未設定のときは「確認用ビルド」として、
 * 全ページに noindex を付け、robots.txt でも検索エンジンの巡回を止める。
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const distDir = path.join(rootDir, "dist-lite");
const ssrDir = path.join(rootDir, ".ssr-lite");

function fail(message) {
  console.error(`\n[prerender] エラー: ${message}\n`);
  process.exit(1);
}

const templatePath = path.join(distDir, "index.html");
if (!fs.existsSync(templatePath)) fail("dist-lite/index.html がありません。先に vite build --mode lite を実行してください。");

const entryFile = ["entry-server.js", "entry-server.mjs"].map((f) => path.join(ssrDir, f)).find((f) => fs.existsSync(f));
if (!entryFile) fail(".ssr-lite/entry-server.js がありません。先に SSR 用のビルドを実行してください。");

const server = await import(pathToFileURL(entryFile).href);
const { render, preloadAll, getPrerenderRoutes, getFeedData, SITE_URL, LANGS, NOINDEX_ALL, newsErrors } = server;

// ---- ニュース・コラムの書き方チェック（間違いがあればビルドを止める） ----
if (newsErrors.length) {
  fail("ニュース・コラムの Markdown に間違いがあります。\n  - " + newsErrors.join("\n  - "));
}

const template = fs.readFileSync(templatePath, "utf8");
if (!template.includes('<div id="root"></div>')) fail('index.html に <div id="root"></div> が見つかりません。');

// 全ページのプログラムと記事の本文を読み込んでから HTML を作る
await preloadAll();

// ---- ページごとの先読み（modulepreload）----
// Vite が出力する manifest.json で、ソースファイル → 出力された JS ファイルを調べる
const manifestPath = path.join(distDir, ".vite", "manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : null;
if (!manifest) console.warn("[prerender] 注意: manifest.json がないため、ページごとの先読み設定を省略します");

function chunkFiles(key, seen = new Set()) {
  const chunk = manifest?.[key];
  if (!chunk || chunk.isEntry || seen.has(key)) return [];
  seen.add(key);
  return [chunk.file, ...(chunk.imports || []).flatMap((k) => chunkFiles(k, seen))];
}

// ページのプログラム・そのページの文言ファイル・記事の本文を先読みする
function preloadTags(route) {
  const keys = [route.file, route.bodyFile, ...(route.sources || [])].filter(Boolean);
  const files = [...new Set(keys.flatMap((k) => chunkFiles(k)))];
  return files.map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`);
}

// ---- HTML の組み立て ----

// React が出力した <title> <meta> <link rel=canonical|alternate> を <head> に移すために取り出す
const HEAD_TAG_RE = /<title>[\s\S]*?<\/title>|<meta\b[^>]*?\/?>|<link\b[^>]*?rel="(?:canonical|alternate)"[^>]*?\/?>/g;

function buildPage(route) {
  let body = render(route.url);
  const headTags = [];
  body = body.replace(HEAD_TAG_RE, (tag) => {
    headTags.push(tag.replace(/^<(\w+)/, "<$1 data-pre"));
    return "";
  });

  const html = template
    // index.html の仮のタイトル・説明（data-pre 付き）は、ページごとのものに置き換える
    .replace(/<title data-pre[^>]*>[\s\S]*?<\/title>\s*/, "")
    .replace(/<meta name="description"[^>]*data-pre[^>]*>\s*/, "")
    .replace("</head>", `    ${[...headTags, ...preloadTags(route)].join("\n    ")}\n  </head>`)
    // data-path: この HTML がどの URL 用か。404.html のように別の URL で返されたときは、ブラウザで作り直す（main.jsx）
    .replace('<div id="root"></div>', `<div id="root" data-path="${route.url}">${body}</div>`)
    .replace(/<html lang="[^"]*"/, `<html lang="${route.lang}"`);

  if (!/<title/.test(html)) fail(`${route.url}: タイトルが出力されませんでした`);
  return html;
}

/** URL を出力先のファイルに変換する（/company/ → dist-lite/company/index.html） */
function outFile(route) {
  if (route.outFile) return path.join(distDir, route.outFile);
  const clean = route.url.replace(/^\/+|\/+$/g, "");
  return path.join(distDir, clean, "index.html");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const routes = getPrerenderRoutes();
for (const route of routes) {
  write(outFile(route), buildPage(route));
}
console.log(`[prerender] ${routes.length} ページを HTML 化しました`);

// ---- 更新日（sitemap.xml の lastmod）----
// 文言ファイルの最終更新日を Git の履歴から取る。Git で管理していない・未コミットの変更があるときは、
// ファイルの更新日時を使う。記事は Markdown の date / updated を使う。
const fileDateCache = new Map();
function git(args) {
  return execFileSync("git", args, { cwd: rootDir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}
function fileDate(rel) {
  if (fileDateCache.has(rel)) return fileDateCache.get(rel);
  const abs = path.join(rootDir, rel);
  let date = "";
  try {
    const modified = git(["status", "--porcelain", "--", rel]);
    if (!modified) date = git(["log", "-1", "--format=%cs", "--", rel]);
  } catch {
    // Git がない環境では、ファイルの更新日時を使う
  }
  if (!date && fs.existsSync(abs)) date = fs.statSync(abs).mtime.toISOString().slice(0, 10);
  fileDateCache.set(rel, date);
  return date;
}
function lastmodOf(route) {
  const dates = [...route.sources.map(fileDate), ...route.dates].filter(Boolean).sort();
  return dates[dates.length - 1] || "";
}

// ---- sitemap.xml / robots.txt ----
const xmlEscape = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// 公開URLが未設定の確認用ビルドでは、手元の確認用サーバーの URL で作る
const baseUrl = SITE_URL || "http://localhost:4173";
const urlOf = (p) => baseUrl + (p === "/" ? "/" : `${p.replace(/\/+$/, "")}/`);
const enOf = (p) => (p === "/" ? "/en/" : `/en${p}`);

const sitemapEntries = routes
  .filter((r) => r.sitemap)
  .map((r) => {
    const alternates = LANGS.includes("en") && r.langs.includes("en")
      ? [
          `    <xhtml:link rel="alternate" hreflang="ja" href="${xmlEscape(urlOf(r.base))}" />`,
          `    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(urlOf(enOf(r.base)))}" />`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(urlOf(r.base))}" />`,
        ].join("\n")
      : "";
    const lastmod = lastmodOf(r);
    return [
      "  <url>",
      `    <loc>${xmlEscape(urlOf(r.url))}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
      alternates,
      "  </url>",
    ].filter(Boolean).join("\n");
  });

write(
  path.join(distDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    sitemapEntries.join("\n") +
    `\n</urlset>\n`
);

write(
  path.join(distDir, "robots.txt"),
  NOINDEX_ALL
    ? "# 確認用ビルド（公開URLが未設定）のため、検索エンジンの巡回を止めています\nUser-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
);
console.log(`[prerender] sitemap.xml（${sitemapEntries.length} 件）と robots.txt を作りました`);

// ---- RSS フィード ----
function rssDate(isoDate) {
  // 日付だけのデータなので、日本時間の 9:00 として扱う
  return new Date(`${isoDate}T09:00:00+09:00`).toUTCString();
}

for (const lang of LANGS) {
  const feed = getFeedData(lang);
  const prefix = lang === "en" ? "/en" : "";
  const items = feed.items
    .map((item) => {
      const link = urlOf(`${prefix}/news/${item.slug}`);
      return [
        "    <item>",
        `      <title>${xmlEscape(item.title)}</title>`,
        `      <link>${xmlEscape(link)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
        `      <pubDate>${rssDate(item.date)}</pubDate>`,
        `      <category>${xmlEscape(item.category)}</category>`,
        `      <description>${xmlEscape(item.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const feedPath = `${prefix}/feed.xml`;
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>${xmlEscape(feed.title)}</title>\n` +
    `    <link>${xmlEscape(urlOf(`${prefix}/news`))}</link>\n` +
    `    <description>${xmlEscape(feed.description)}</description>\n` +
    `    <language>${lang}</language>\n` +
    `    <atom:link href="${xmlEscape(baseUrl + feedPath)}" rel="self" type="application/rss+xml" />\n` +
    (feed.items[0] ? `    <lastBuildDate>${rssDate(feed.items[0].date)}</lastBuildDate>\n` : "") +
    items +
    `\n  </channel>\n</rss>\n`;

  write(path.join(distDir, feedPath.replace(/^\//, "")), xml);
}
console.log(`[prerender] RSS フィードを作りました（${LANGS.map((l) => (l === "en" ? "/en/feed.xml" : "/feed.xml")).join(", ")}）`);

// 一時ファイル（SSR 用のビルド・manifest）は公開しないので消す
fs.rmSync(ssrDir, { recursive: true, force: true });
fs.rmSync(path.join(distDir, ".vite"), { recursive: true, force: true });

if (NOINDEX_ALL) {
  console.warn(
    "\n[prerender] 注意: 公開URL（VITE_SITE_URL）が未設定のため、確認用ビルドにしました。" +
      "\n  全ページに noindex を付け、検索エンジンに登録されないようにしています。" +
      "\n  公開するときは deploy-lite.sh などのデプロイスクリプトを使うか、.env.lite に VITE_SITE_URL を書いてください。\n"
  );
}
