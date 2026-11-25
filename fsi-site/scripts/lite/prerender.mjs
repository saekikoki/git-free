/**
 * prerender.mjs - 廉価版のページを事前に HTML 化する（npm run build:lite の最後に実行される）
 *
 * 前提: 次の2つのビルドが終わっていること（package.json の build:lite が順に実行する）
 *   1. vite build --mode lite                       → dist-lite/（ブラウザ用の JS・CSS）
 *   2. vite build --mode lite --ssr ...entry-server  → .ssr-lite/（HTML を作るための JS）
 *
 * このスクリプトがすること:
 *   - ページごとの HTML（dist-lite/company/index.html など）を作る
 *   - 存在しないURL用の dist-lite/404.html を作る
 *   - sitemap.xml（検索エンジン向けのページ一覧）と robots.txt を作る
 *   - RSS フィード（dist-lite/feed.xml と dist-lite/en/feed.xml）を作る
 */
import fs from "node:fs";
import path from "node:path";
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
const { render, getPrerenderRoutes, getFeedData, SITE_URL, LANGS, newsErrors } = server;

// ---- ニュースの書き方チェック（間違いがあればビルドを止める） ----
if (newsErrors.length) {
  fail("ニュースの Markdown に間違いがあります。\n  - " + newsErrors.join("\n  - "));
}

const template = fs.readFileSync(templatePath, "utf8");
if (!template.includes('<div id="root"></div>')) fail('index.html に <div id="root"></div> が見つかりません。');

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

  let html = template
    // index.html の仮のタイトル・説明（data-pre 付き）は、ページごとのものに置き換える
    .replace(/<title data-pre[^>]*>[\s\S]*?<\/title>\s*/, "")
    .replace(/<meta name="description"[^>]*data-pre[^>]*>\s*/, "")
    .replace("</head>", `    ${headTags.join("\n    ")}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace(/<html lang="[^"]*"/, `<html lang="${route.lang}"`);

  if (!/<title/.test(html)) fail(`${route.url}: タイトルが出力されませんでした`);
  return html;
}

/** URL を出力先のファイルに変換する（/company → dist-lite/company/index.html） */
function outFile(route) {
  if (route.file) return path.join(distDir, route.file);
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

// ---- sitemap.xml / robots.txt ----
const xmlEscape = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const urlOf = (p) => SITE_URL + (p === "/" ? "/" : `${p.replace(/\/+$/, "")}/`);
const enOf = (p) => (p === "/" ? "/en" : `/en${p}`);
const multiLang = LANGS.includes("en");

const sitemapEntries = routes
  .filter((r) => r.sitemap)
  .map((r) => {
    const alternates = multiLang
      ? [
          `    <xhtml:link rel="alternate" hreflang="ja" href="${xmlEscape(urlOf(r.base))}" />`,
          `    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(urlOf(enOf(r.base)))}" />`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(urlOf(r.base))}" />`,
        ].join("\n")
      : "";
    return [
      "  <url>",
      `    <loc>${xmlEscape(urlOf(r.url))}</loc>`,
      r.lastmod ? `    <lastmod>${r.lastmod}</lastmod>` : "",
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

write(path.join(distDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
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
    `    <atom:link href="${xmlEscape(SITE_URL + feedPath)}" rel="self" type="application/rss+xml" />\n` +
    (feed.items[0] ? `    <lastBuildDate>${rssDate(feed.items[0].date)}</lastBuildDate>\n` : "") +
    items +
    `\n  </channel>\n</rss>\n`;

  write(path.join(distDir, feedPath.replace(/^\//, "")), xml);
}
console.log(`[prerender] RSS フィードを作りました（${LANGS.map((l) => (l === "en" ? "/en/feed.xml" : "/feed.xml")).join(", ")}）`);

// SSR 用の一時ファイルは不要なので消す
fs.rmSync(ssrDir, { recursive: true, force: true });

if (SITE_URL.includes("example.com")) {
  console.warn(
    "\n[prerender] 注意: SITE_URL が仮の値（example.com）のままです。" +
      "\n  公開URLを .env.lite の VITE_SITE_URL に書くか、deploy-lite.sh でデプロイしてください（自動で設定されます）。\n"
  );
}
