/**
 * トップページの文言（日本語）
 *
 * title: 検索結果やブラウザのタブに出るトップページのタイトル。
 *        「サイト名｜何をしている会社か」の形にすると、検索で見つけてもらいやすい
 * hero: 一番上のメインビジュアル
 * services / achievements: 見出しだけ。カードの中身は services.js・cases.js から表示する
 * columns: 最新コラムの見出し（廉価版のみ）
 * 内容は架空のサンプルです。
 */
import P from "../company-profile";

export default {
  title: `${P.siteName}｜施設警備・巡回警備・交通誘導警備・雑踏警備`,
  description: `${P.siteName}は、施設警備・巡回警備・保安警備・交通誘導警備・雑踏警備・駐車場警備を提供する警備会社です。教育を受けた警備員が、施設・道路・イベントの安全と安心を24時間365日支えます。`,

  hero: {
    eyebrow: "SECURITY SERVICES",
    titleLine1: "人と街の安全を、",
    titleAccent: "24時間守る警備",
    lead: "施設・道路・イベント・駐車場まで。\n教育を受けた警備員が、現場の安全と安心を支えます。",
    primaryButton: "警備サービスを見る",
    secondaryButton: "お問い合わせ",
  },

  services: {
    eyebrow: "SECURITY SERVICES",
    title: "事業内容",
    sub: "現場の安全を支える6つの警備サービス",
  },

  achievements: {
    title: "実績紹介",
    sub: "さまざまな現場で、安全と安心を支えています",
    carouselLabel: "導入事例スライダー",
    carouselRole: "カルーセル",
    prev: "前の事例",
    next: "次の事例",
    dot: "事例",
    stats: [
      { id: "sites", value: "480", unit: "か所+", label: "契約施設・現場数" },
      { id: "guards", value: "420", unit: "名", label: "警備員数" },
      { id: "satisfaction", value: "98", unit: "%", label: "顧客満足度" },
      { id: "years", value: "30", unit: "年", label: "事業継続年数" },
    ],
  },

  columns: {
    heading: "コラム",
    more: "コラム一覧を見る",
  },
};
