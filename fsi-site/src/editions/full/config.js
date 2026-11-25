/**
 * フル版のナビゲーション設定
 *
 * Header / Footer / サイトマップは、ここで定義したリンクを表示する。
 */
import AuthNavLinks from "../../features/auth/AuthNavLinks";

export const EDITION = "full";

// --- 以下は廉価版で使う設定。フル版では使わないので空にしている ---
// （共通の画面が同じ名前で読み込むため、値だけ用意しておく）
export const SITE_URL = "";       // 空のときは canonical / OGP の URL を出さない
export const LANGS = ["ja"];      // 英語ページなし
export const FEATURES = {};       // FAQ・サイト内検索・RSS なし
export const CONTACT_EMAIL = "";
export const CONTACT_PHONE = "";

// ヘッダーのリンク
export const headerNav = [
  { label: "トップ", to: "/" },
  { label: "ニュース", to: "/news" },
  { label: "掲示板", to: "/board" },
  { label: "チャット", to: "/chat" },
  { label: "ゲーム", to: "/game" },
  { label: "企業情報", to: "/company" },
  { label: "お問い合わせ", to: "/contact" },
];

// ヘッダー右端に追加表示する部品（ログイン/ログアウト/管理）
export const HeaderExtra = AuthNavLinks;

// フッターのリンク列
export const footerNav = [
  {
    heading: "企業情報",
    links: [
      { label: "会社概要", to: "/company" },
      { label: "採用情報", to: "/recruit" },
      { label: "お問い合わせ", to: "/contact" },
    ],
  },
  {
    heading: "コンテンツ",
    links: [
      { label: "ニュースリリース", to: "/news" },
      { label: "掲示板", to: "/board" },
      { label: "チャット", to: "/chat" },
    ],
  },
  {
    heading: "その他",
    links: [
      { label: "ゲーム", to: "/game" },
      { label: "サイトマップ", to: "/sitemap" },
      { label: "ログイン", to: "/login" },
    ],
  },
];

// サイトマップページの構成
export const sitemap = [
  {
    heading: "メインページ",
    links: [
      { label: "トップページ", to: "/" },
      { label: "企業情報", to: "/company" },
      { label: "採用情報", to: "/recruit" },
    ],
  },
  { heading: "ニュース", links: [{ label: "ニュースリリース一覧", to: "/news" }] },
  {
    heading: "コミュニティ",
    links: [
      { label: "掲示板", to: "/board" },
      { label: "チャット", to: "/chat" },
      { label: "ゲーム", to: "/game" },
    ],
  },
  {
    heading: "ユーザー",
    links: [
      { label: "ログイン", to: "/login" },
      { label: "管理者パネル", to: "/admin" },
    ],
  },
  {
    heading: "その他",
    links: [
      { label: "お問い合わせ", to: "/contact" },
      { label: "個人情報保護への取り組み", to: "/privacy" },
      { label: "サイトのご利用について", to: "/terms" },
    ],
  },
];
