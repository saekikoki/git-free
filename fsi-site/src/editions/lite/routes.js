/**
 * routes.js - 廉価版のページ一覧（URL）
 *
 * path は日本語版のURL。英語版は先頭に /en が付く（例: /company → /en/company/）。
 * この一覧は次の3か所で使う。
 *   - App.jsx … 画面の切り替え
 *   - boot.js … ページを開いたときに、そのページのプログラムと文言を先に読み込む
 *   - entry-server.jsx … ビルド時の事前HTML化・sitemap.xml
 *
 *   file       … そのページのプログラム（pageEntries.js の読み込み先と同じにする。ビルド時の先読み設定に使う）
 *   content    … そのページで使う文言ファイル（src/content/<言語>/<名前>.js）。
 *                ★ ページで useContent().xxx を使ったら、xxx をここに必ず書く（書き忘れると画面が出ない）
 *                common と company-profile は最初から読み込むので書かなくてよい。
 *                sitemap.xml の更新日（lastmod）の計算にも使う
 *   props      … 画面に渡す値（ニュースとコラムで同じ画面を使い分ける）
 *   collection … 記事のページ（news / columns）。:sk の部分が記事のファイル名になる
 *   collections… 一覧に記事を表示するページ（更新日の計算に使う）
 *   items      … 事業内容・導入事例・募集職種のページ。:slug の部分が src/content の slug になる
 *   feature    … config.js の FEATURES がオンのときだけ作るページ
 *   sitemap: false … sitemap.xml に載せない（検索結果ページなど）
 *
 * 新しいページを追加するときは、ここと pageEntries.js の両方に足す。
 */
import { CONTENT_NAMES } from "../../content";

export const PAGE_PATHS = [
  { path: "/", file: "src/features/home/HomePage.jsx", content: ["home", "services", "cases"], collections: ["news", "columns"] },
  { path: "/services", file: "src/features/services/ServicesPage.jsx", content: ["services"] },
  { path: "/services/:slug", file: "src/features/services/ServiceDetailPage.jsx", items: "services", content: ["services", "cases"] },
  { path: "/cases", file: "src/features/cases/CasesPage.jsx", content: ["cases"] },
  { path: "/cases/:slug", file: "src/features/cases/CaseDetailPage.jsx", items: "cases", content: ["cases", "services"] },
  { path: "/news", file: "src/features/news/NewsListPage.jsx", props: { kind: "news" }, content: [], collections: ["news"] },
  { path: "/news/:sk", file: "src/features/news/NewsDetailPage.jsx", props: { kind: "news" }, content: [], collection: "news" },
  { path: "/columns", file: "src/features/news/NewsListPage.jsx", props: { kind: "columns" }, content: [], collections: ["columns"], feature: "columns" },
  { path: "/columns/:sk", file: "src/features/news/NewsDetailPage.jsx", props: { kind: "columns" }, content: [], collection: "columns", feature: "columns" },
  { path: "/company", file: "src/features/company/CompanyPage.jsx", content: ["company"] },
  { path: "/recruit", file: "src/features/company/RecruitPage.jsx", content: ["recruit"] },
  { path: "/recruit/jobs/:slug", file: "src/features/company/JobDetailPage.jsx", items: "jobs", content: ["recruit"] },
  { path: "/contact", file: "src/editions/lite/ContactPage.jsx", content: ["contact"] },
  { path: "/faq", file: "src/features/faq/FaqPage.jsx", content: ["faq"], feature: "faq" },
  // サイト内検索は全ページの文言から探すので、すべて読み込む
  { path: "/search", file: "src/features/search/SearchPage.jsx", content: CONTENT_NAMES, sitemap: false, feature: "search" },
  { path: "/privacy", file: "src/features/legal/PrivacyPage.jsx", content: ["legal"] },
  { path: "/terms", file: "src/features/legal/TermsPage.jsx", content: ["legal"] },
  { path: "/sitemap", file: "src/features/legal/SitemapPage.jsx", content: ["legal"] },
];

/** 日本語版のパスを英語版のパスにする */
export function enPath(path) {
  return path === "/" ? "/en" : `/en${path}`;
}
