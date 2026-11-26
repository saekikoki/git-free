/**
 * トップページの文言（日本語）
 *
 * title: 検索結果やブラウザのタブに出るトップページのタイトル。
 *        「サイト名｜何をしている会社か」の形にすると、検索で見つけてもらいやすい
 * hero: 一番上のメインビジュアル
 * services / achievements: 見出しだけ。カードの中身は services.js・cases.js から表示する
 * columns: 最新コラムの見出し（廉価版のみ）
 */
import P from "../company-profile";

export default {
  title: `${P.siteName}｜システム開発・クラウド導入・運用保守`,
  description: `${P.siteName}は、システム開発・AWSを中心としたクラウド導入・24時間365日の運用保守で、企業のDXを企画から運用まで一貫して支援するITソリューション企業です。`,

  hero: {
    eyebrow: "IT × OT × AI SOLUTIONS",
    titleLine1: "高信頼・高性能な",
    titleAccent: "ITソリューション",
    lead: "企業の未来を支えるシステムを、確かな技術力で。\n設立から30年の実績が、次世代の価値を創造します。",
    primaryButton: "事業内容を見る",
    secondaryButton: "お問い合わせ",
  },

  services: {
    eyebrow: "OUR BUSINESS",
    title: "事業内容",
    sub: "お客様のビジネスを支える3つのソリューション",
  },

  achievements: {
    title: "実績紹介",
    sub: "さまざまな業界のお客様と共に、確かな成果を創出しています",
    carouselLabel: "導入事例スライダー",
    carouselRole: "カルーセル",
    prev: "前の事例",
    next: "次の事例",
    dot: "事例",
    stats: [
      { id: "projects", value: "1,200", unit: "件+", label: "プロジェクト実績" },
      { id: "clients", value: "350", unit: "社+", label: "取引企業数" },
      { id: "satisfaction", value: "98", unit: "%", label: "顧客満足度" },
      { id: "years", value: "30", unit: "年", label: "事業継続年数" },
    ],
  },

  columns: {
    heading: "コラム",
    more: "コラム一覧を見る",
  },
};
