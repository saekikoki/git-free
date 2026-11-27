/**
 * 共通の文言（日本語）
 *
 * ヘッダー・フッター・ニュース・コラム・検索など、複数のページで使う文言をまとめている。
 * 英語版は ../en/common.js。項目の名前（キー）は日本語版と英語版でそろえること。
 * 文中の「\n」は画面上で改行になる。
 * サイト名は ../company-profile.js の siteName。
 */
import P from "../company-profile";

export default {
  siteName: P.siteName,
  defaultDescription: "施設・道路・イベントの安全と安心を、24時間365日支える警備会社です。",
  breadcrumbLabel: "現在位置",
  breadcrumbTop: "トップ",
  skipToContent: "本文へ移動",

  header: {
    menu: "メニュー",
    mainNav: "メインナビゲーション",
    mobileNav: "モバイルナビゲーション",
    search: "サイト内検索",
    themeToDark: "ダークモードに切り替える",
    themeToLight: "ライトモードに切り替える",
    langSwitch: "EN",
    // 読み上げ用の名前。画面の表示（EN）を含めること（音声操作で「EN」と言って押せるように）
    langSwitchLabel: "EN（English・英語のページへ）",
  },

  footer: {
    tagline: "人と街の安全を、\n24時間365日守る警備会社。",
    privacy: "個人情報保護方針",
    terms: "サイトのご利用について",
    sitemap: "サイトマップ",
    rss: "RSS",
    copyright: "All rights reserved.",
  },

  scrollTop: "ページの先頭へ戻る",

  news: {
    eyebrow: "NEWS RELEASE",
    heading: "ニュースリリース",
    lead: "当社の最新情報・お知らせをお届けします。",
    description: `${P.siteName}のニュースリリース一覧です。新しい警備サービス・組織・採用・お知らせなどの最新情報をお届けします。`,
    empty: "ニュースはまだありません。",
    more: "ニュース一覧を表示する",
    all: "すべて",
    allYears: "すべての年",
    yearLabel: "年で絞り込む",
    searchPlaceholder: "キーワードで検索",
    searchLabel: "ニュースをキーワードで検索",
    countSuffix: "件のニュース",
    noMatch: "該当するニュースがありません。",
    pagination: "ページ送り",
    prevPage: "前へ",
    nextPage: "次へ",
    notFoundTitle: "記事が見つかりません",
    notFoundText: "お探しの記事は削除されたか、URLが間違っている可能性があります。",
    backToList: "← ニュース一覧に戻る",
    toList: "ニュース一覧へ",
    loading: "読み込み中...",
    related: "関連ニュース",
    prevArticle: "前の記事",
    nextArticle: "次の記事",
    share: "この記事をシェア",
    copyLink: "リンクをコピー",
    copied: "コピーしました",
    print: "印刷する",
    rss: "RSSで購読",
    updated: "更新",
    jaOnly: "",
    // カテゴリ名の表示（日本語版はそのまま表示する）
    categories: {},
  },

  // コラム（廉価版のみ）。ここにない項目は上の news の文言を使う
  columns: {
    eyebrow: "COLUMN",
    heading: "コラム",
    lead: "警備の現場から、施設管理や安全対策に役立つ知識をお届けします。",
    description: `${P.siteName}の警備のプロが、施設警備・交通誘導・イベントの安全対策など、現場で役立つ知識を解説するコラムです。`,
    empty: "コラムはまだありません。",
    more: "コラム一覧を見る",
    searchLabel: "コラムをキーワードで検索",
    countSuffix: "件のコラム",
    noMatch: "該当するコラムがありません。",
    backToList: "← コラム一覧に戻る",
    toList: "コラム一覧へ",
    related: "関連コラム",
    author: "執筆",
  },

  notFound: {
    title: "ページが見つかりません",
    text: "お探しのページは移動または削除された可能性があります。\nURLをご確認いただくか、下のリンクからお探しください。",
    toTop: "トップページへ",
    toSearch: "サイト内検索",
    toSitemap: "サイトマップ",
  },
};
