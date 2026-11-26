/**
 * 採用情報ページの文言（日本語）
 *
 * jobs の category / types は絞り込みボタンに使う。
 * 新しい職種を足すときは、category は filters.categories の中の名前、
 * types は filters.types の中の名前を使うこと。
 *
 * jobs.items の1件ごとに、詳細ページ /recruit/jobs/<slug> ができる。
 * 詳細ページには Google の求人検索に載せるための情報（構造化データ）も出力する。
 *   slug           … URL（半角英小文字・数字・ハイフン）。英語版と同じにする
 *   employmentType … FULL_TIME（正社員）/ PART_TIME / CONTRACTOR（契約）/ INTERN など（Google の決まった値）
 *   salary         … 年収の下限・上限（円）。不要なら行ごと消す
 *   datePosted     … 掲載開始日。validThrough … 掲載終了日（任意。過ぎた求人は Google に載らなくなる）
 * 求人を締め切ったら、その職種を items から消してください（古い求人が残ると Google の評価が下がる）。
 */
import P from "../company-profile";

export default {
  title: "採用情報",
  description: `${P.legalName.ja}の採用情報。募集職種・社員インタビュー・福利厚生・選考フローをご紹介します。`,

  hero: {
    eyebrow: "RECRUIT",
    title: "技術で未来を、\n共につくる仲間を求めています",
    lead: `あなたの挑戦が、社会を動かす力になる。\n${P.shortName.ja}は、成長を続けるすべての人を歓迎します。`,
    button: "エントリーする",
  },

  stats: {
    eyebrow: "WORK ENVIRONMENT",
    title: "数字で見る職場環境",
    items: [
      { value: "1,200", suffix: "名", label: "従業員数" },
      { value: "35", suffix: "%", label: "女性管理職比率" },
      { value: "92", suffix: "%", label: "有給取得率" },
      { value: "4.2", suffix: "日", label: "平均残業（週）" },
    ],
  },

  values: {
    eyebrow: "OUR VALUES",
    title: "求める人物像",
    items: [
      { icon: "🚀", title: "挑戦する人", text: "現状に満足せず、新しい技術や課題に主体的に挑む姿勢を大切にします。" },
      { icon: "🤝", title: "共創する人", text: "チームやお客様と協力し、共に価値を生み出せる人を歓迎します。" },
      { icon: "📚", title: "学び続ける人", text: "変化の速いIT業界で、自ら学び成長し続ける意欲を評価します。" },
    ],
  },

  jobs: {
    eyebrow: "POSITIONS",
    title: "募集職種",
    filters: {
      categoryLabel: "職種",
      typeLabel: "採用区分",
      all: "すべて",
      categories: ["エンジニア", "ビジネス", "コーポレート"],
      types: ["新卒", "中途"],
    },
    countSuffix: "件の職種",
    noMatch: "条件に合う職種はありません。",
    apply: "詳細・応募 →",
    // 職種の詳細ページの見出し
    detail: {
      back: "← 募集職種の一覧に戻る",
      overview: "募集要項",
      responsibilities: "仕事内容",
      requirements: "応募資格（必須）",
      preferred: "歓迎する経験・スキル",
      conditions: "勤務条件",
      employmentType: "雇用形態",
      location: "勤務地",
      salary: "給与",
      salaryFormat: (min, max) => `年収 ${min / 10000}万円〜${max / 10000}万円（経験・能力を考慮して決定）`,
      workStyle: "働き方",
      hiringType: "採用区分",
      datePosted: "掲載日",
      applyTitle: "この職種に応募する",
      applyText: "お問い合わせページのメールアドレス宛てに、希望職種・氏名・連絡先をお送りください。",
      applyButton: "応募方法を見る",
      otherJobs: "ほかの募集職種",
      notFound: "この求人は掲載を終了したか、URLが間違っています。",
      employmentTypes: { FULL_TIME: "正社員", PART_TIME: "パート・アルバイト", CONTRACTOR: "契約社員", INTERN: "インターン" },
    },
    items: [
      {
        slug: "systems-engineer",
        category: "エンジニア",
        title: "システムエンジニア",
        types: ["新卒", "中途"],
        desc: "業務系・基幹系システムの設計・開発・運用を担当。",
        employmentType: "FULL_TIME",
        salary: { min: 4000000, max: 8000000 },
        datePosted: "2025-07-01",
        workStyle: "フレックスタイム制（コアタイム 11:00〜15:00）、リモートワーク可（週2日程度の出社）",
        responsibilities: [
          "お客様の業務をヒアリングし、要件定義・設計を行う",
          "Web アプリケーション・業務システムの開発とテスト",
          "リリース後の運用・改善提案",
        ],
        requirements: ["プログラミングの経験（言語は問いません。新卒の方は授業・独学でも可）", "チームで協力して仕事を進めた経験"],
        preferred: ["業務システムの開発経験", "Java・TypeScript・Python のいずれかの実務経験"],
      },
      {
        slug: "cloud-architect",
        category: "エンジニア",
        title: "クラウドアーキテクト",
        types: ["中途"],
        desc: "AWSを中心としたクラウド基盤の設計・構築をリード。",
        employmentType: "FULL_TIME",
        salary: { min: 6000000, max: 11000000 },
        datePosted: "2025-07-01",
        workStyle: "フレックスタイム制、リモートワーク可（出社は月数回程度）",
        responsibilities: [
          "クラウド移行案件の現状調査と移行計画の作成",
          "AWS を中心としたクラウド基盤の設計・構築（IaC）",
          "社内エンジニアへの技術指導",
        ],
        requirements: ["AWS・Azure・Google Cloud いずれかでの設計・構築経験（2年以上）", "Linux サーバーの構築・運用経験"],
        preferred: ["AWS 認定（ソリューションアーキテクト等）", "Terraform・CloudFormation・CDK の利用経験"],
      },
      {
        slug: "data-scientist",
        category: "エンジニア",
        title: "AI・データサイエンティスト",
        types: ["新卒", "中途"],
        desc: "機械学習を活用したデータ分析・AIソリューション開発。",
        employmentType: "FULL_TIME",
        salary: { min: 4500000, max: 10000000 },
        datePosted: "2025-07-01",
        workStyle: "フレックスタイム制、リモートワーク可",
        responsibilities: [
          "お客様のデータの分析と、課題解決のためのモデル開発",
          "生成AIを活用した業務改善ツールの企画・開発",
          "分析結果のお客様への報告・提案",
        ],
        requirements: ["統計学・機械学習の基礎知識", "Python でのデータ分析の経験（研究・独学でも可）"],
        preferred: ["実データを使った機械学習モデルの開発・運用経験", "クラウドの機械学習サービスの利用経験"],
      },
      {
        slug: "solution-sales",
        category: "ビジネス",
        title: "営業 / ソリューション営業",
        types: ["新卒", "中途"],
        desc: "お客様の課題をヒアリングし、最適な提案を行う。",
        employmentType: "FULL_TIME",
        salary: { min: 4000000, max: 9000000 },
        datePosted: "2025-07-01",
        workStyle: "フレックスタイム制、直行直帰・リモートワーク可",
        responsibilities: ["お客様の経営・業務の課題のヒアリング", "エンジニアと協力した提案書・見積もりの作成", "契約後のプロジェクトの進捗確認とフォロー"],
        requirements: ["社内外の人と協力して仕事を進めた経験", "IT に興味があり、学び続ける意欲"],
        preferred: ["法人営業の経験", "IT 業界での営業経験"],
      },
      {
        slug: "hr-general-affairs",
        category: "コーポレート",
        title: "人事 / 総務",
        types: ["中途"],
        desc: "採用・人材育成・組織開発などを担う。",
        employmentType: "FULL_TIME",
        salary: { min: 4000000, max: 7500000 },
        datePosted: "2025-07-01",
        workStyle: "フレックスタイム制、リモートワーク可（週2日程度の出社）",
        responsibilities: ["新卒・中途採用の企画と運営", "研修制度の企画と運営", "社内制度の整備・労務管理"],
        requirements: ["人事・総務の実務経験（2年以上）"],
        preferred: ["IT 企業での人事経験", "採用広報の経験"],
      },
      {
        slug: "corporate-planning",
        category: "コーポレート",
        title: "経営企画",
        types: ["中途"],
        desc: "全社戦略の立案・推進を担う。",
        employmentType: "FULL_TIME",
        salary: { min: 6000000, max: 12000000 },
        datePosted: "2025-07-01",
        workStyle: "フレックスタイム制、リモートワーク可",
        responsibilities: ["中期経営計画の策定と進捗管理", "新規事業・提携の検討", "経営会議の運営と資料作成"],
        requirements: ["経営企画・事業企画・コンサルティングのいずれかの経験（3年以上）"],
        preferred: ["IT 業界の事業理解", "M&A・アライアンスの実務経験"],
      },
    ],
  },

  interviews: {
    eyebrow: "PEOPLE",
    title: "社員インタビュー",
    sub: "現場で活躍する社員に、仕事のやりがいを聞きました。",
    more: "続きを読む",
    close: "閉じる",
    items: [
      {
        initial: "K",
        color: "#0b3c5d",
        name: "K.T.",
        role: "クラウドアーキテクト / 2018年 中途入社",
        quote: "お客様の「本当に困っていること」から設計できるのが、この仕事の面白さです。",
        body: "前職ではオンプレミスの運用を担当していました。入社後はAWS移行の案件を任され、今は大規模な基盤設計をリードしています。技術の選択肢が多い分、お客様と一緒に答えを探すプロセスにやりがいを感じます。資格取得支援制度を使って、入社から3年で上位資格を4つ取得しました。",
      },
      {
        initial: "M",
        color: "#1a7a8c",
        name: "M.S.",
        role: "AI・データサイエンティスト / 2021年 新卒入社",
        quote: "入社1年目から、製造現場のデータに向き合うプロジェクトに参加できました。",
        body: "大学では統計学を学んでいました。入社後の研修でシステム開発の基礎を身につけ、配属後すぐに予知保全のプロジェクトへ。現場の方と何度も話し合いながらモデルを改善し、実際に設備の停止を防げたときの達成感は忘れられません。",
      },
      {
        initial: "A",
        color: "#7d3c98",
        name: "A.N.",
        role: "ソリューション営業 / 2016年 新卒入社",
        quote: "技術者と一緒に提案をつくるので、営業でも技術の話が深くできます。",
        body: "お客様の課題をうかがい、エンジニアと一緒に解決策を組み立てるのが私の役割です。育児休業から復帰した後も、時短勤務とリモートワークを組み合わせて、無理なく成果を出せています。チームで助け合う文化が根づいている会社です。",
      },
    ],
  },

  benefits: {
    eyebrow: "BENEFITS",
    title: "福利厚生・制度",
    items: [
      { icon: "🏥", title: "各種社会保険完備" },
      { icon: "🏠", title: "住宅手当・家賃補助" },
      { icon: "📈", title: "資格取得支援制度" },
      { icon: "💻", title: "リモートワーク制度" },
      { icon: "🌴", title: "年間休日125日" },
      { icon: "👶", title: "育児・介護休業制度" },
      { icon: "🎓", title: "社内研修・e-learning" },
      { icon: "🍽️", title: "社員食堂・カフェ" },
    ],
  },

  flow: {
    eyebrow: "FLOW",
    title: "選考フロー",
    note: "エントリーから内定まで、通常1〜2か月程度です。",
    items: [
      { step: "01", title: "エントリー", desc: "お問い合わせ先から必要事項をご連絡ください", duration: "随時" },
      { step: "02", title: "書類選考", desc: "履歴書・職務経歴書を確認します", duration: "約1週間" },
      { step: "03", title: "面接（2〜3回）", desc: "現場社員・役員と面談します。オンライン可", duration: "約2〜4週間" },
      { step: "04", title: "内定", desc: "条件のご提示・入社手続き", duration: "約1週間" },
    ],
  },

  cta: {
    title: "あなたの挑戦を、待っています。",
    text: "まずはお気軽にエントリーください。",
    // よくある質問ページがある版（廉価版）だけ、text の後ろに続けて表示する
    faqText: "よくある質問もご覧いただけます。",
    button: "エントリーする",
    faq: "よくある質問を見る",
  },
};
