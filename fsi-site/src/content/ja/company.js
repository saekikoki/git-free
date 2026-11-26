/**
 * 企業情報ページの文言（日本語）
 *
 * 社名・所在地・代表者・設立日・資本金・従業員数・地図・最寄り駅は ../company-profile.js から自動で入る。
 * このファイルでは、理念・数字・役員・沿革など、ページ固有の文言を編集する。
 * 現在の内容はすべて架空のサンプルです。
 */
import P, { formatAddress, formatFoundingDate, foundingYear } from "../company-profile";

export default {
  title: "企業情報",
  description: `${P.legalName.ja}（${P.siteName}）の企業情報。企業理念・会社概要・役員・沿革・アクセスをご紹介します。`,

  hero: {
    eyebrow: "COMPANY",
    title: "企業情報",
    lead: "IT×OT×AIの融合で、社会の未来を支える。\n設立から積み重ねてきた技術が、次世代の価値を生み出します。",
  },

  philosophy: {
    eyebrow: "PHILOSOPHY",
    title: "企業理念",
    items: [
      { icon: "🎯", title: "Mission", subtitle: "使命", text: "技術の力で社会課題を解決し、人々の豊かな未来を創造する。" },
      { icon: "🔭", title: "Vision", subtitle: "目指す姿", text: "IT×OT×AIの融合で、あらゆる産業のDXをリードするテクノロジーカンパニー。" },
      { icon: "💎", title: "Values", subtitle: "価値観", text: "誠実・挑戦・共創。お客様と共に価値を生み出し続ける。" },
    ],
  },

  highlights: {
    eyebrow: "BY THE NUMBERS",
    title: `数字で見る${P.shortName.ja}`,
    items: [
      { value: foundingYear(P), suffix: "年設立", label: "30年の実績", plain: true },
      { value: "350", suffix: "社+", label: "取引企業数" },
      { value: "1,200", suffix: "件+", label: "プロジェクト実績" },
      { value: "98", suffix: "%", label: "顧客満足度" },
    ],
  },

  profile: {
    eyebrow: "CORPORATE PROFILE",
    title: "会社概要",
    rows: [
      { label: "会社名", value: `${P.legalName.ja}（${P.legalName.en}）` },
      { label: "本社所在地", value: formatAddress(P, "ja") },
      { label: "代表者", value: `${P.representative.ja.title} ${P.representative.ja.name}` },
      { label: "設立", value: formatFoundingDate(P, "ja") },
      { label: "資本金", value: P.capital.ja },
      { label: "従業員数", value: P.employees.ja },
      { label: "事業内容", value: "システム開発、クラウド導入・移行、システム運用・保守、DX推進支援" },
      { label: "取引銀行", value: "〇〇銀行、△△銀行（サンプル）" },
    ],
  },

  executives: {
    eyebrow: "EXECUTIVES",
    title: "役員一覧",
    items: [
      { name: P.representative.ja.name, role: P.representative.ja.title, initial: "Y" },
      { name: "佐藤 花子", role: "取締役 CFO", initial: "S" },
      { name: "鈴木 一郎", role: "取締役 CTO", initial: "S" },
      { name: "田中 美咲", role: "執行役員 事業本部長", initial: "T" },
    ],
  },

  history: {
    eyebrow: "HISTORY",
    title: "沿革",
    items: [
      { year: foundingYear(P), event: `${P.legalName.ja}を設立。受託システム開発を開始` },
      { year: "2003", event: "金融・製造業向けの基幹システム開発を本格展開" },
      { year: "2010", event: "24時間365日の運用・保守サービスを開始" },
      { year: "2016", event: "クラウド導入・移行支援サービスを開始" },
      { year: "2024", event: "IT×OT×AIの融合による総合DX企業へ" },
    ],
  },

  access: {
    eyebrow: "ACCESS",
    title: "アクセス",
    officeName: "本社",
    address: formatAddress(P, "ja"),
    mapQuery: P.mapQuery,
    routes: P.routes.ja,
    mapButton: "地図を表示する",
    mapNotice: "地図は Google マップを読み込んで表示します。",
    openInMaps: "Google マップで開く",
    mapTitle: "本社の地図",
  },
};
