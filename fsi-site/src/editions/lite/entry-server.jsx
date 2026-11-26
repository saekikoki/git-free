/**
 * entry-server.jsx - 廉価版の「事前HTML化（プリレンダリング）」用の入口
 *
 * ブラウザでは使わない。npm run build:lite の途中で Node.js から呼ばれ、
 * ページを1枚ずつ HTML の文字列にする（scripts/lite/prerender.mjs が使う）。
 *
 * 事前HTML化すると、
 *   - 検索エンジンや SNS が、ページごとのタイトル・説明・本文を読める
 *   - /company/ などを直接開いても HTTP 200 で返る（404 にならない）
 *   - JavaScript の読み込み前から中身が表示されるので、表示が速く感じる
 */
/* eslint-disable react-refresh/only-export-components -- 画面ではなくビルド用の関数をまとめたファイルのため */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { PAGE_PATHS, enPath } from "./routes";
import { PAGE_ENTRIES } from "./pageEntries";
import { collections, newsErrors } from "./newsLoader";
import { SITE_URL, LANGS, FEATURES, NOINDEX_ALL } from "./config";
import { getContent, loadContent } from "../../content";

/** 全ページのプログラム・全言語の文言・全記事の本文を読み込む（HTML を作る前に1回だけ呼ぶ） */
export async function preloadAll() {
  await Promise.all(Object.values(PAGE_ENTRIES).map((entry) => entry.load()));
  for (const lang of LANGS) {
    await loadContent(lang);
    await Promise.all(Object.values(collections).map((c) => c.loadAll(lang)));
  }
}

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

/** :slug を持つページの slug の一覧（事業内容・導入事例・募集職種） */
function itemSlugs(name, lang) {
  const c = getContent(lang);
  const list = { services: c.services.items, cases: c.cases.items, jobs: c.recruit.jobs.items }[name] || [];
  return list.map((item) => item.slug);
}

/**
 * 書き出すページの一覧。
 *   url        … ページのURL（末尾は /）
 *   lang       … 言語
 *   base       … 日本語版のURL（hreflang に使う）
 *   langs      … このページがある言語（英語版のない記事は ["ja"]）
 *   sitemap    … sitemap.xml に載せるか
 *   file       … ページのプログラム（先読み設定に使う）
 *   bodyFile   … 記事の本文ファイル（先読み設定に使う）
 *   sources    … 更新日の計算に使うファイル
 *   dates      … 更新日の候補（記事の日付など）
 */
export function getPrerenderRoutes() {
  const routes = [];
  const profileFile = "src/content/company-profile.js";
  const slash = (p) => (p.endsWith("/") ? p : `${p}/`);

  for (const lang of LANGS) {
    const toLang = (p) => slash(lang === "en" ? enPath(p) : p);
    const contentFiles = (names = []) => [profileFile, ...names.map((n) => `src/content/${lang}/${n}.js`)];

    for (const page of PAGE_PATHS) {
      if (page.feature && !FEATURES[page.feature]) continue;
      const common = { lang, file: page.file, sitemap: page.sitemap !== false };

      if (page.collection) {
        // 記事ページ: 英語ページは英語版のある記事だけ作る
        for (const item of collections[page.collection].items) {
          if (lang === "en" && !item.en) continue;
          const base = page.path.replace(":sk", item.SK);
          const dir = `src/editions/lite/${page.collection}`;
          routes.push({
            ...common,
            url: toLang(base),
            base: slash(base),
            langs: item.en ? ["ja", "en"] : ["ja"],
            bodyFile: `${dir}/${item.SK}${lang === "en" ? ".en" : ""}.md`,
            sources: [],
            dates: [item.updated || item.publishedAt],
          });
        }
        continue;
      }

      if (page.items) {
        for (const slug of itemSlugs(page.items, lang)) {
          const base = page.path.replace(":slug", slug);
          routes.push({ ...common, url: toLang(base), base: slash(base), langs: LANGS, sources: contentFiles(page.content), dates: [] });
        }
        continue;
      }

      // 一覧ページは、いちばん新しい記事の日付も更新日の候補にする
      const dates = (page.collections || [])
        .filter((k) => collections[k] && (k !== "columns" || FEATURES.columns))
        .map((k) => collections[k].items[0])
        .filter(Boolean)
        .map((item) => item.updated || item.publishedAt);
      routes.push({ ...common, url: toLang(page.path), base: slash(page.path), langs: LANGS, sources: contentFiles(page.content), dates });
    }
  }

  // 存在しないURL用のページ（dist-lite/404.html になる）
  routes.push({ url: "/404", lang: "ja", sitemap: false, file: null, outFile: "404.html", langs: ["ja"], sources: [], dates: [] });
  return routes;
}

/** RSS フィード用の記事一覧（言語ごと。英語のフィードは英語版のある記事だけ） */
export function getFeedData(lang) {
  const t = getContent(lang).common;
  return {
    title: `${t.siteName} ${t.news.heading}`,
    description: t.news.description,
    items: collections.news.items
      .filter((a) => lang !== "en" || a.en)
      .map((a) => {
        const n = lang === "en" ? { ...a, ...a.en } : a;
        return {
          slug: a.SK,
          title: n.title,
          date: a.publishedAt,
          category: (t.news.categories || {})[a.category] || a.category,
          description: n.summary || n.excerpt || "",
        };
      }),
  };
}

export { SITE_URL, LANGS, NOINDEX_ALL, newsErrors };
