/**
 * トップページの文言（日本語）
 *
 * hero: 一番上のメインビジュアル
 * services: 事業内容の3枚のカード
 * achievements: 実績の数字と、導入事例のスライド
 */
export default {
  description: "高信頼・高性能なITソリューションで企業の未来を支えるFSI-STYLE CORPの公式サイトです。",

  hero: {
    eyebrow: "IT × OT × AI SOLUTIONS",
    titleLine1: "高信頼・高性能な",
    titleAccent: "ITソリューション",
    lead: "企業の未来を支えるシステムを、確かな技術力で。\n半世紀を超える実績が、次世代の価値を創造します。",
    primaryButton: "事業内容を見る",
    secondaryButton: "お問い合わせ",
  },

  services: {
    eyebrow: "OUR BUSINESS",
    title: "事業内容",
    sub: "お客様のビジネスを支える3つのソリューション",
    items: [
      {
        icon: "💻",
        title: "システム開発",
        text: "業務系・基幹系システムを高品質で提供。要件定義から運用まで一貫対応します。",
        tags: ["業務システム", "基幹系", "内製化支援"],
      },
      {
        icon: "☁️",
        title: "クラウド導入",
        text: "AWSを中心としたクラウド移行を支援。コスト最適化とスケーラビリティを両立します。",
        tags: ["AWS", "クラウド移行", "IaC"],
      },
      {
        icon: "🔧",
        title: "運用・保守",
        text: "24時間365日の安定運用を実現。監視・障害対応・改善提案までトータルサポート。",
        tags: ["24/365監視", "SRE", "保守運用"],
      },
    ],
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
      { id: "years", value: "55", unit: "年", label: "事業継続年数" },
    ],
    items: [
      {
        id: 1,
        title: "大手金融機関向け基幹システム刷新",
        description: "10年稼働したレガシーシステムをクラウドネイティブに移行。処理速度3倍、運用コスト40%削減を実現。",
        metric: "処理速度",
        metricValue: "3倍",
        category: "システム開発",
        color: "#0b3c5d",
        icon: "🏦",
      },
      {
        id: 2,
        title: "製造業DX推進プロジェクト",
        description: "IoTセンサーとAI分析を活用した予知保全システムを構築。設備稼働率を95%以上に向上。",
        metric: "設備稼働率",
        metricValue: "95%+",
        category: "DX推進",
        color: "#1a7a8c",
        icon: "🏭",
      },
      {
        id: 3,
        title: "官公庁向けセキュリティ基盤構築",
        description: "ゼロトラストアーキテクチャに基づくセキュリティ基盤を設計・構築。年間インシデント数を大幅に削減。",
        metric: "インシデント",
        metricValue: "80%減",
        category: "セキュリティ",
        color: "#7d3c98",
        icon: "🛡️",
      },
      {
        id: 4,
        title: "小売業ECプラットフォーム開発",
        description: "マイクロサービスアーキテクチャを採用した高可用性ECサイトを構築。ピーク時10万リクエスト/秒に対応。",
        metric: "ピーク処理",
        metricValue: "10万req/s",
        category: "クラウド",
        color: "#2874a6",
        icon: "🛒",
      },
      {
        id: 5,
        title: "全国500拠点のネットワーク統合",
        description: "SD-WANを活用して全国拠点のネットワークを統合。通信コストを60%削減しつつ帯域を倍増。",
        metric: "通信コスト",
        metricValue: "60%減",
        category: "インフラ",
        color: "#117a65",
        icon: "🌐",
      },
    ],
  },
};
