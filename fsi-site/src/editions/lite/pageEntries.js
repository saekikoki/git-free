/**
 * pageEntries.js - 廉価版の各ページのプログラムを「必要になったときに読み込む」ための設定
 *
 * 全ページのプログラムを最初にまとめて送ると、トップページを開くだけでも
 * 企業情報や採用情報のプログラムまで読み込むことになり、表示が遅くなる。
 * そこでページごとにファイルを分け（コード分割）、開いたページの分だけを読み込む。
 *
 * import("...") のパスは routes.js の file と同じにすること。
 */

/** ページ1つ分の「読み込み口」を作る。一度読み込んだら Component に入れて使い回す */
function lazyPage(loader) {
  const entry = { Component: null, promise: null };
  entry.load = () => {
    if (!entry.promise) {
      entry.promise = loader().then((mod) => {
        entry.Component = mod.default;
        return mod.default;
      });
    }
    return entry.promise;
  };
  return entry;
}

export const PAGE_ENTRIES = {
  "/": lazyPage(() => import("../../features/home/HomePage")),
  "/services": lazyPage(() => import("../../features/services/ServicesPage")),
  "/services/:slug": lazyPage(() => import("../../features/services/ServiceDetailPage")),
  "/cases": lazyPage(() => import("../../features/cases/CasesPage")),
  "/cases/:slug": lazyPage(() => import("../../features/cases/CaseDetailPage")),
  "/news": lazyPage(() => import("../../features/news/NewsListPage")),
  "/news/:sk": lazyPage(() => import("../../features/news/NewsDetailPage")),
  "/columns": lazyPage(() => import("../../features/news/NewsListPage")),
  "/columns/:sk": lazyPage(() => import("../../features/news/NewsDetailPage")),
  "/company": lazyPage(() => import("../../features/company/CompanyPage")),
  "/recruit": lazyPage(() => import("../../features/company/RecruitPage")),
  "/recruit/jobs/:slug": lazyPage(() => import("../../features/company/JobDetailPage")),
  "/contact": lazyPage(() => import("./ContactPage")),
  "/faq": lazyPage(() => import("../../features/faq/FaqPage")),
  "/search": lazyPage(() => import("../../features/search/SearchPage")),
  "/privacy": lazyPage(() => import("../../features/legal/PrivacyPage")),
  "/terms": lazyPage(() => import("../../features/legal/TermsPage")),
  "/sitemap": lazyPage(() => import("../../features/legal/SitemapPage")),
};
