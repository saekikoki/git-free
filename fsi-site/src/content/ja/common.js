/**
 * 共通の文言（日本語）
 *
 * ヘッダー・フッター・ニュース・検索など、複数のページで使う文言をまとめている。
 * 英語版は ../en/common.js。項目の名前（キー）は日本語版と英語版でそろえること。
 * 文中の「\n」は画面上で改行になる。
 */
export default {
  siteName: "FSI-STYLE CORP",
  defaultDescription: "高信頼・高性能なITソリューションで企業の未来を支えます。",
  breadcrumbLabel: "現在位置",
  breadcrumbTop: "トップ",

  header: {
    menu: "メニュー",
    mainNav: "メインナビゲーション",
    mobileNav: "モバイルナビゲーション",
    search: "サイト内検索",
    themeToDark: "ダークモードに切り替える",
    themeToLight: "ライトモードに切り替える",
    langSwitch: "EN",
    langSwitchLabel: "English（英語のページへ）",
  },

  footer: {
    tagline: "IT×OT×AIの融合で、\n企業の未来を支えるテクノロジーカンパニー。",
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
    description: "FSI-STYLE CORPのニュースリリース一覧です。",
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
    notFoundText: "お探しのニュースは削除されたか、URLが間違っている可能性があります。",
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
    langNotice: "",
    // カテゴリ名の表示（日本語版はそのまま表示する）
    categories: {},
  },

  notFound: {
    title: "ページが見つかりません",
    text: "お探しのページは移動または削除された可能性があります。\nURLをご確認いただくか、下のリンクからお探しください。",
    toTop: "トップページへ",
    toSearch: "サイト内検索",
    toSitemap: "サイトマップ",
  },
};
