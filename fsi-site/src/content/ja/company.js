/**
 * 企業情報ページの文言（日本語）
 *
 * philosophy: 企業理念 / highlights: 数字で見る / profile: 会社概要の表
 * executives: 役員 / history: 沿革 / access: アクセス（地図）
 */
export default {
  title: "企業情報",
  description: "富士ソフト株式会社の企業情報。理念・会社概要・役員・沿革・アクセスをご紹介します。",

  hero: {
    eyebrow: "COMPANY",
    title: "企業情報",
    lead: "IT×OT×AIの融合で、社会の未来を支える。\n半世紀を超える技術の蓄積が、次世代の価値を生み出します。",
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
    title: "数字で見る富士ソフト",
    items: [
      { value: "1970", suffix: "年創業", label: "半世紀を超える実績", plain: true },
      { value: "350", suffix: "社+", label: "取引企業数" },
      { value: "1,200", suffix: "件+", label: "プロジェクト実績" },
      { value: "98", suffix: "%", label: "顧客満足度" },
    ],
  },

  profile: {
    eyebrow: "CORPORATE PROFILE",
    title: "会社概要",
    rows: [
      { label: "会社名", value: "富士ソフト株式会社（FUJI SOFT INCORPORATED）" },
      { label: "本社所在地", value: "〒231-8008 神奈川県横浜市中区桜木町1-1" },
      { label: "代表者", value: "代表取締役 社長執行役員 兼 CEO　室岡 光浩" },
      { label: "創業", value: "1970年（昭和45年）5月15日" },
      { label: "資本金", value: "1億円" },
      { label: "従業員数", value: "連結 18,000名（2025年時点）" },
      { label: "事業内容", value: "システムインテグレーション、DX推進、クラウド、AI・IoTソリューション" },
      { label: "取引銀行", value: "三菱UFJ銀行、みずほ銀行、三井住友銀行、横浜銀行" },
    ],
  },

  executives: {
    eyebrow: "EXECUTIVES",
    title: "役員一覧",
    items: [
      { name: "室岡 光浩", role: "代表取締役 社長執行役員 兼 CEO", initial: "M" },
      { name: "山田 太郎", role: "取締役 副社長執行役員", initial: "Y" },
      { name: "佐藤 花子", role: "取締役 専務執行役員 CFO", initial: "S" },
      { name: "鈴木 一郎", role: "取締役 常務執行役員 CTO", initial: "S" },
    ],
  },

  history: {
    eyebrow: "HISTORY",
    title: "沿革",
    items: [
      { year: "1970", event: "富士ソフトウエア研究所として創業" },
      { year: "1985", event: "組み込みソフトウェア事業を本格展開" },
      { year: "2000", event: "東証一部上場、システム開発事業を拡大" },
      { year: "2015", event: "クラウド・AI事業に本格参入" },
      { year: "2023", event: "IT×OT×AI融合による総合DX企業へ進化" },
    ],
  },

  access: {
    eyebrow: "ACCESS",
    title: "アクセス",
    officeName: "本社",
    address: "〒231-8008 神奈川県横浜市中区桜木町1-1",
    // 地図の検索に使う住所（Google マップで場所を探すときの文字列）
    mapQuery: "神奈川県横浜市中区桜木町1-1",
    routes: [
      "JR・横浜市営地下鉄「桜木町駅」より徒歩3分",
      "みなとみらい線「みなとみらい駅」より徒歩8分",
    ],
    mapButton: "地図を表示する",
    mapNotice: "地図は Google マップを読み込んで表示します。",
    openInMaps: "Google マップで開く",
    mapTitle: "本社の地図",
  },
};
