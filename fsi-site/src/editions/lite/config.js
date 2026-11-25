/**
 * 廉価版の設定
 *
 * 掲示板・チャット・ゲーム・ログインへのリンクは持たない。
 * label は日本語、labelEn は英語ページ（/en/...）で表示する名前。
 */
import HeaderTools from "./HeaderTools";

export const EDITION = "lite";

// 公開するサイトのURL（末尾の / は付けない）。
// 検索エンジン向けの URL（canonical）、SNS の共有カード、sitemap.xml、RSS に使う。
// 優先順位: 環境変数 VITE_SITE_URL（deploy-lite.sh が自動で設定）→ .env.lite → 下の既定値
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.example.com").replace(/\/+$/, "");

// 対応する言語（ja = 日本語、en = 英語）
export const LANGS = ["ja", "en"];

// 廉価版で使う機能（共通の画面が、この値を見て表示を切り替える）
export const FEATURES = {
  faq: true,      // よくある質問ページ（/faq）
  search: true,   // サイト内検索（/search）
  rss: true,      // RSS 配信（/feed.xml）
};

// お問い合わせページに表示する受付メールアドレス（フォームはない）
// 公開前に実際の受付アドレスへ変更してください。
export const CONTACT_EMAIL = "info@example.com";

// お問い合わせページに表示する電話番号と受付時間（公開前に実際の番号へ変更してください）
// 受付時間の文言は src/content/ja/contact.js と src/content/en/contact.js にある
export const CONTACT_PHONE = "03-0000-0000";

export const headerNav = [
  { label: "トップ", labelEn: "Home", to: "/" },
  { label: "ニュース", labelEn: "News", to: "/news" },
  { label: "企業情報", labelEn: "Company", to: "/company" },
  { label: "採用情報", labelEn: "Careers", to: "/recruit" },
  { label: "お問い合わせ", labelEn: "Contact", to: "/contact" },
];

// ヘッダー右端に表示する部品（検索・ダークモード・言語切り替え）
export const HeaderExtra = HeaderTools;

export const footerNav = [
  {
    heading: "企業情報",
    headingEn: "Company",
    links: [
      { label: "会社概要", labelEn: "Company", to: "/company" },
      { label: "採用情報", labelEn: "Careers", to: "/recruit" },
      { label: "お問い合わせ", labelEn: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "コンテンツ",
    headingEn: "Contents",
    links: [
      { label: "ニュースリリース", labelEn: "News", to: "/news" },
      { label: "よくある質問", labelEn: "FAQ", to: "/faq" },
    ],
  },
  {
    heading: "その他",
    headingEn: "Others",
    links: [
      { label: "サイト内検索", labelEn: "Site search", to: "/search" },
      { label: "サイトマップ", labelEn: "Sitemap", to: "/sitemap" },
      { label: "個人情報保護方針", labelEn: "Privacy Policy", to: "/privacy" },
    ],
  },
];

export const sitemap = [
  {
    heading: "メインページ",
    headingEn: "Main pages",
    links: [
      { label: "トップページ", labelEn: "Home", to: "/" },
      { label: "企業情報", labelEn: "Company", to: "/company" },
      { label: "採用情報", labelEn: "Careers", to: "/recruit" },
    ],
  },
  {
    heading: "ニュース",
    headingEn: "News",
    links: [{ label: "ニュースリリース一覧", labelEn: "All news", to: "/news" }],
  },
  {
    heading: "サポート",
    headingEn: "Support",
    links: [
      { label: "お問い合わせ", labelEn: "Contact", to: "/contact" },
      { label: "よくある質問", labelEn: "FAQ", to: "/faq" },
      { label: "サイト内検索", labelEn: "Site search", to: "/search" },
    ],
  },
  {
    heading: "その他",
    headingEn: "Others",
    links: [
      { label: "個人情報保護への取り組み", labelEn: "Privacy Policy", to: "/privacy" },
      { label: "サイトのご利用について", labelEn: "Terms of Use", to: "/terms" },
    ],
  },
];
