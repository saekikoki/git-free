/**
 * routes.js - 廉価版のページ一覧（URL）
 *
 * path は日本語版のURL。英語版は先頭に /en が付く（例: /company → /en/company）。
 * App.jsx はこの一覧から画面の切り替えを作り、
 * ビルド時の事前HTML化（entry-server.jsx）・sitemap.xml もこの一覧を使う。
 *
 *   prerender: false … 事前HTML化しない（/news/:sk は記事ごとに別途書き出す）
 *   sitemap: false   … sitemap.xml に載せない（検索結果ページなど）
 *
 * 新しいページを追加するときは、ここと App.jsx の PAGE_ELEMENTS の両方に足す。
 */
export const PAGE_PATHS = [
  { path: "/" },
  { path: "/news" },
  { path: "/news/:sk", prerender: false },
  { path: "/company" },
  { path: "/recruit" },
  { path: "/contact" },
  { path: "/faq" },
  { path: "/search", sitemap: false },
  { path: "/privacy" },
  { path: "/terms" },
  { path: "/sitemap" },
];

/** 日本語版のパスを英語版のパスにする */
export function enPath(path) {
  return path === "/" ? "/en" : `/en${path}`;
}
