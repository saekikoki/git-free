/**
 * 共通の文言（英語）
 *
 * 日本語版は ../ja/common.js。キーは日本語版とそろえること。
 */
import P from "../company-profile";

export default {
  siteName: P.siteName,
  defaultDescription: "Reliable, high-performance IT solutions that support the future of business.",
  breadcrumbLabel: "You are here",
  breadcrumbTop: "Home",
  skipToContent: "Skip to content",

  header: {
    menu: "Menu",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    search: "Site search",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    langSwitch: "JP",
    langSwitchLabel: "JP (日本語のページへ / Japanese page)",
  },

  footer: {
    tagline: "A technology company supporting\nthe future of business through IT × OT × AI.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    sitemap: "Sitemap",
    rss: "RSS",
    copyright: "All rights reserved.",
  },

  scrollTop: "Back to top",

  news: {
    eyebrow: "NEWS RELEASE",
    heading: "News",
    lead: `The latest news and announcements from ${P.siteName}.`,
    description: `News releases from ${P.siteName}: new services, organization, IR and announcements.`,
    empty: "No news yet.",
    more: "View all news",
    all: "All",
    allYears: "All years",
    yearLabel: "Filter by year",
    searchPlaceholder: "Search by keyword",
    searchLabel: "Search news by keyword",
    countSuffix: "articles",
    noMatch: "No matching news found.",
    pagination: "Pagination",
    prevPage: "Prev",
    nextPage: "Next",
    notFoundTitle: "Article not found",
    notFoundText: "The article may have been removed, or the URL may be incorrect.",
    backToList: "← Back to news",
    toList: "Go to news",
    loading: "Loading...",
    related: "Related news",
    prevArticle: "Previous",
    nextArticle: "Next",
    share: "Share this article",
    copyLink: "Copy link",
    copied: "Copied",
    print: "Print",
    rss: "Subscribe via RSS",
    updated: "Updated",
    // 英語版のない記事に付ける目印（クリックすると日本語のページを開く）
    jaOnly: "Japanese",
    // カテゴリ名の英語表記（Markdown では日本語のカテゴリ名を書く）
    categories: {
      "お知らせ": "Notice",
      "製品": "Products",
      "組織": "Organization",
      "IR": "IR",
      "採用": "Careers",
      "クラウド": "Cloud",
      "開発": "Development",
      "運用": "Operations",
      "DX": "DX",
    },
  },

  columns: {
    eyebrow: "COLUMN",
    heading: "Columns",
    lead: "Practical insights from the front lines of system development, cloud and operations.",
    description: `Columns by ${P.siteName} engineers explaining practical know-how on system development, cloud migration, operations and DX.`,
    empty: "No columns yet.",
    more: "View all columns",
    searchLabel: "Search columns by keyword",
    countSuffix: "columns",
    noMatch: "No matching columns found.",
    backToList: "← Back to columns",
    toList: "Go to columns",
    related: "Related columns",
    author: "Author",
  },

  notFound: {
    title: "Page not found",
    text: "The page you are looking for may have been moved or deleted.\nPlease check the URL or use the links below.",
    toTop: "Home",
    toSearch: "Site search",
    toSitemap: "Sitemap",
  },
};
