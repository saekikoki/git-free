/**
 * 廉価版の設定
 *
 * 掲示板・チャット・ゲーム・ログインへのリンクは持たない。
 * label は日本語、labelEn は英語ページ（/en/...）で表示する名前。
 * 社名・住所・連絡先は src/content/company-profile.js にある。
 */
import HeaderTools from "./HeaderTools";

export const EDITION = "lite";

// 公開するサイトのURL（末尾の / は不要）。.env.lite の VITE_SITE_URL で設定する。
// 検索エンジン向けの正式URL（canonical）、SNS の共有カード、sitemap.xml、RSS に使う。
//   - deploy-lite.sh / deploy-lite-cdn.sh / cloudformation/deploy.sh は、公開URLを自動で設定してビルドする
//   - 独自ドメインで公開する場合は .env.lite に書く（例: VITE_SITE_URL=https://www.example.co.jp）
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/+$/, "");

// 公開URLが決まっていないビルド（手元の確認用）は、検索エンジンに登録させない。
// 間違ったURLが検索エンジンに登録されるのを防ぐため。
export const NOINDEX_ALL = !SITE_URL;

// 検索エンジンの所有権確認用のコード（Google Search Console / Bing Webmaster Tools）。
// 各サービスの「HTML タグ」で確認する方法を選ぶと表示される content="..." の中身を貼る。
// 空のままなら何も出力しない。手順は docs/TODO_LAUNCH.md を参照。
export const SEARCH_VERIFICATION = {
  google: "",   // <meta name="google-site-verification" content="ここ">
  bing: "",     // <meta name="msvalidate.01" content="ここ">
};

// 対応する言語（ja = 日本語、en = 英語）
export const LANGS = ["ja", "en"];

// 廉価版で使う機能（共通の画面が、この値を見て表示を切り替える）
export const FEATURES = {
  faq: true,      // よくある質問ページ（/faq）
  search: true,   // サイト内検索（/search）
  rss: true,      // RSS 配信（/feed.xml）
  columns: true,  // コラム（/columns。記事は src/editions/lite/columns/*.md）
};

export const headerNav = [
  { label: "事業内容", labelEn: "Services", to: "/services" },
  { label: "導入事例", labelEn: "Cases", to: "/cases" },
  { label: "ニュース", labelEn: "News", to: "/news" },
  { label: "企業情報", labelEn: "Company", to: "/company" },
  { label: "採用情報", labelEn: "Careers", to: "/recruit" },
  { label: "お問い合わせ", labelEn: "Contact", to: "/contact" },
];

// ヘッダー右端に表示する部品（検索・ダークモード・言語切り替え）
export const HeaderExtra = HeaderTools;

export const footerNav = [
  {
    heading: "事業内容",
    headingEn: "Services",
    links: [
      { label: "システム開発", labelEn: "System Development", to: "/services/system-development" },
      { label: "クラウド導入・移行", labelEn: "Cloud Adoption", to: "/services/cloud" },
      { label: "運用・保守", labelEn: "Operations", to: "/services/operations" },
      { label: "導入事例", labelEn: "Case Studies", to: "/cases" },
    ],
  },
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
      { label: "コラム", labelEn: "Columns", to: "/columns" },
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
    heading: "事業内容",
    headingEn: "Services",
    links: [
      { label: "事業内容一覧", labelEn: "All services", to: "/services" },
      { label: "システム開発", labelEn: "System Development", to: "/services/system-development" },
      { label: "クラウド導入・移行", labelEn: "Cloud Adoption & Migration", to: "/services/cloud" },
      { label: "運用・保守", labelEn: "Operations & Maintenance", to: "/services/operations" },
      { label: "導入事例", labelEn: "Case Studies", to: "/cases" },
    ],
  },
  {
    heading: "ニュース・コラム",
    headingEn: "News & Columns",
    links: [
      { label: "ニュースリリース一覧", labelEn: "All news", to: "/news" },
      { label: "コラム一覧", labelEn: "All columns", to: "/columns" },
    ],
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
