/**
 * entry-server.jsx - 廉価版の「事前HTML化（プリレンダリング）」用の入口
 *
 * ブラウザでは使わない。npm run build:lite の途中で Node.js から呼ばれ、
 * ページを1枚ずつ HTML の文字列にする（scripts/lite/prerender.mjs が使う）。
 *
 * 事前HTML化すると、
 *   - 検索エンジンや SNS が、ページごとのタイトル・説明・本文を読める
 *   - /company などを直接開いても HTTP 200 で返る（404 にならない）
 *   - JavaScript の読み込み前から中身が表示されるので、表示が速く感じる
 */
/* eslint-disable react-refresh/only-export-components -- 画面ではなくビルド用の関数をまとめたファイルのため */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { PAGE_PATHS, enPath } from "./routes";
import { articles, newsErrors } from "./newsLoader";
import { SITE_URL, LANGS } from "./config";
import { getContent } from "../../content";

/** 指定した URL のページを HTML 文字列にする */
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

/**
 * 書き出すページの一覧。
 *   { url: "/company", lang: "ja", sitemap: true, lastmod?: "2025-07-01" }
 */
export function getPrerenderRoutes() {
  const routes = [];
  for (const lang of LANGS) {
    const toLang = (p) => (lang === "en" ? enPath(p) : p);
    for (const page of PAGE_PATHS) {
      if (page.prerender === false) continue;
      routes.push({ url: toLang(page.path), lang, sitemap: page.sitemap !== false, base: page.path });
    }
    for (const a of articles) {
      routes.push({ url: toLang(`/news/${a.SK}`), lang, sitemap: true, lastmod: a.publishedAt, base: `/news/${a.SK}` });
    }
  }
  // 存在しないURL用のページ（dist-lite/404.html になる）
  routes.push({ url: "/404", lang: "ja", sitemap: false, file: "404.html" });
  return routes;
}

/** RSS フィード用の記事一覧（言語ごと） */
export function getFeedData(lang) {
  const t = getContent(lang).common;
  return {
    title: `${t.siteName} ${t.news.heading}`,
    description: t.news.description,
    items: articles.map((a) => {
      const n = lang === "en" && a.en ? { ...a, ...a.en } : a;
      return {
        slug: a.SK,
        title: n.title,
        date: a.publishedAt,
        category: (t.news.categories || {})[a.category] || a.category,
        description: n.summary || String(n.content || "").slice(0, 200),
      };
    }),
  };
}

export { SITE_URL, LANGS, newsErrors };
