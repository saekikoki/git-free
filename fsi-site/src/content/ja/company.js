/**
 * 企業情報ページの文言（日本語）
 *
 * 社名・所在地・代表者・設立日・資本金・従業員数・認定・地図・最寄り駅は ../company-profile.js から自動で入る。
 * このファイルでは、理念・数字・役員・沿革など、ページ固有の文言を編集する。
 * 現在の内容はすべて架空のサンプルです。
 */
import P, { formatAddress, formatFoundingDate, foundingYear } from "../company-profile";

export default {
  title: "企業情報",
  description: `${P.legalName.ja}（${P.siteName}）の企業情報。企業理念・会社概要・警備業の認定・役員・沿革・アクセスをご紹介します。`,

  hero: {
    eyebrow: "COMPANY",
    title: "企業情報",
    lead: "人と街の安全を、24時間365日守る。\n設立から積み重ねてきた経験と教育が、現場の安心を支えます。",
  },

  philosophy: {
    eyebrow: "PHILOSOPHY",
    title: "企業理念",
    items: [
      { icon: "🎯", title: "Mission", subtitle: "使命", text: "警備を通じて、人々の安全と安心を守り、地域の暮らしを支える。" },
      { icon: "🔭", title: "Vision", subtitle: "目指す姿", text: "お客様と地域から最も信頼される、教育の行き届いた警備会社。" },
      { icon: "💎", title: "Values", subtitle: "価値観", text: "誠実・責任・思いやり。どんな現場でも、礼儀と規律を忘れない。" },
    ],
  },

  highlights: {
    eyebrow: "BY THE NUMBERS",
    title: `数字で見る${P.shortName.ja}`,
    items: [
      { value: foundingYear(P), suffix: "年設立", label: "30年の実績", plain: true },
      { value: "480", suffix: "か所+", label: "契約施設・現場数" },
      { value: "420", suffix: "名", label: "警備員数" },
      { value: "24", suffix: "時間365日", label: "緊急対応体制" },
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
      { label: "警備業の認定", value: P.securityLicense.ja },
      { label: "事業内容", value: "警備業（施設警備業務・巡回警備業務・保安警備業務・交通誘導警備業務・雑踏警備業務・駐車場警備業務）" },
      { label: "加盟団体", value: "警備業協会 会員（サンプル）" },
      { label: "取引銀行", value: "〇〇銀行、△△銀行（サンプル）" },
    ],
  },

  executives: {
    eyebrow: "EXECUTIVES",
    title: "役員一覧",
    items: [
      { name: P.representative.ja.name, role: P.representative.ja.title, initial: "Y" },
      { name: "佐藤 花子", role: "取締役 管理本部長", initial: "S" },
      { name: "鈴木 一郎", role: "取締役 警備事業本部長", initial: "S" },
      { name: "田中 美咲", role: "執行役員 教育訓練部長", initial: "T" },
    ],
  },

  history: {
    eyebrow: "HISTORY",
    title: "沿革",
    items: [
      { year: foundingYear(P), event: `${P.legalName.ja}を設立。施設警備業務を開始` },
      { year: "2003", event: "交通誘導警備業務・雑踏警備業務を開始" },
      { year: "2010", event: "駐車場警備業務を開始" },
      { year: "2016", event: "24時間体制の緊急対応センターを開設" },
      { year: "2024", event: "警備員の教育訓練施設を拡充" },
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
