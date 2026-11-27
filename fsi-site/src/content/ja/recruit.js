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
 * 内容はすべて架空のサンプルです。
 */
import P from "../company-profile";

export default {
  title: "採用情報",
  description: `${P.legalName.ja}の採用情報。警備員・管制員・教育担当などの募集職種、社員インタビュー、福利厚生、選考フローをご紹介します。`,

  hero: {
    eyebrow: "RECRUIT",
    title: "人の安全を守る仕事を、\n私たちと一緒に",
    lead: `未経験からでも、教育と資格取得の支援で一人前の警備員に。\n${P.shortName.ja}は、安全を守る誇りをもって働くすべての人を歓迎します。`,
    button: "エントリーする",
  },

  stats: {
    eyebrow: "WORK ENVIRONMENT",
    title: "数字で見る職場環境",
    items: [
      { value: "420", suffix: "名", label: "警備員・スタッフ数" },
      { value: "22", suffix: "%", label: "女性の警備員の比率" },
      { value: "86", suffix: "%", label: "有給休暇の取得率" },
      { value: "100", suffix: "%", label: "新任教育の修了率" },
    ],
  },

  values: {
    eyebrow: "OUR VALUES",
    title: "求める人物像",
    items: [
      { icon: "🛡️", title: "責任感のある人", text: "人の安全を預かる仕事です。決められた手順を守り、最後までやり遂げる姿勢を大切にします。" },
      { icon: "🤝", title: "思いやりのある人", text: "お客様・来場者・仲間に、礼儀正しく、丁寧に接することができる人を歓迎します。" },
      { icon: "📚", title: "学び続ける人", text: "資格の取得や研修を通じて、知識と技術を高め続ける意欲を評価します。" },
    ],
  },

  jobs: {
    eyebrow: "POSITIONS",
    title: "募集職種",
    filters: {
      categoryLabel: "職種",
      typeLabel: "採用区分",
      all: "すべて",
      categories: ["警備職", "管制・教育", "管理部門"],
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
      salaryFormat: (min, max) => `年収 ${min / 10000}万円〜${max / 10000}万円（経験・資格を考慮して決定）`,
      workStyle: "勤務時間・働き方",
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
        slug: "facility-guard",
        category: "警備職",
        title: "施設警備員（常駐警備）",
        types: ["新卒", "中途"],
        desc: "ビル・商業施設・病院などに常駐し、出入管理・巡回・防災センター業務を担当。",
        employmentType: "FULL_TIME",
        salary: { min: 3000000, max: 4800000 },
        datePosted: "2025-07-01",
        workStyle: "交替制勤務（日勤・夜勤・24時間勤務のいずれか。配属先による）／月8〜10日の休み",
        responsibilities: [
          "施設の出入口での受付・入退館の管理",
          "館内外の巡回と、施錠・火気・設備の異常の確認",
          "防災センターでの監視と、緊急時の初動対応",
        ],
        requirements: ["警備員の欠格事由に該当しないこと（警備業法の定めによる）", "礼儀正しく、チームで働けること"],
        preferred: ["施設警備業務検定などの資格", "接客・受付の経験", "防災センター要員・防火管理の資格"],
      },
      {
        slug: "patrol-guard",
        category: "警備職",
        title: "巡回警備員",
        types: ["新卒", "中途"],
        desc: "車で複数の施設を巡回し、施錠確認・異常確認を行う。",
        employmentType: "FULL_TIME",
        salary: { min: 3200000, max: 5000000 },
        datePosted: "2025-07-01",
        workStyle: "夜間を中心とした交替制勤務／月8〜10日の休み／会社の車両を使用",
        responsibilities: [
          "決められた順路・時刻での施設の巡回",
          "施錠・開錠の確認と、異常の確認",
          "異常があったときの初動対応と、報告書の作成",
        ],
        requirements: ["普通自動車運転免許（AT限定可）", "警備員の欠格事由に該当しないこと"],
        preferred: ["夜間の勤務の経験", "警備・防犯の仕事の経験"],
      },
      {
        slug: "traffic-crowd-guard",
        category: "警備職",
        title: "交通誘導・雑踏警備員",
        types: ["新卒", "中途"],
        desc: "工事現場・イベント会場で、車両・歩行者・来場者を安全に誘導する。",
        employmentType: "FULL_TIME",
        salary: { min: 3000000, max: 5200000 },
        datePosted: "2025-07-01",
        workStyle: "現場ごとのシフト制（日勤が中心。夜間工事・イベントの日は変動あり）／月8〜10日の休み",
        responsibilities: [
          "工事現場での車両・歩行者の誘導",
          "祭り・花火大会・コンサートなどでの人の流れの整理",
          "迷子・急病人への対応と、本部への連絡",
        ],
        requirements: ["警備員の欠格事由に該当しないこと", "屋外での勤務ができること"],
        preferred: ["交通誘導警備業務・雑踏警備業務の検定資格", "イベントスタッフの経験"],
      },
      {
        slug: "control-center-operator",
        category: "管制・教育",
        title: "管制センター員",
        types: ["中途"],
        desc: "24時間の管制センターで、各現場の連絡受付と緊急時の指令を担当。",
        employmentType: "FULL_TIME",
        salary: { min: 3500000, max: 5500000 },
        datePosted: "2025-07-01",
        workStyle: "交替制勤務（日勤・夜勤）／月8〜10日の休み／管制センター（本社）での勤務",
        responsibilities: [
          "各現場の警備員からの連絡の受付と記録",
          "警報があったときの隊員への指令と、関係機関への連絡",
          "シフトと配置の調整の補助",
        ],
        requirements: ["PC の基本操作（文書作成・メール）ができること", "落ち着いて、正確に連絡を伝えられること"],
        preferred: ["警備・防災・コールセンターの業務経験", "無線機の使用経験"],
      },
      {
        slug: "training-instructor",
        category: "管制・教育",
        title: "教育担当（警備員指導教育責任者）",
        types: ["中途"],
        desc: "新任の警備員の教育と、現任教育の計画・実施を担当。",
        employmentType: "FULL_TIME",
        salary: { min: 4000000, max: 6500000 },
        datePosted: "2025-07-01",
        workStyle: "日勤中心（研修の日程により、土日の勤務あり）／月8〜10日の休み",
        responsibilities: [
          "新任教育・現任教育の計画づくりと講師",
          "現場への巡回指導と、警備員の技術の評価",
          "教育の記録の管理",
        ],
        requirements: ["警備員指導教育責任者の資格（または取得に前向きであること）", "人に教えることが好きなこと"],
        preferred: ["警備の実務経験（3年以上）", "研修・教育の仕事の経験"],
      },
      {
        slug: "administration",
        category: "管理部門",
        title: "総務・人事・経理",
        types: ["中途"],
        desc: "勤怠・給与・採用・契約管理など、警備事業を支える管理業務を担当。",
        employmentType: "FULL_TIME",
        salary: { min: 3500000, max: 5500000 },
        datePosted: "2025-07-01",
        workStyle: "日勤（平日）／月8〜10日の休み／本社勤務",
        responsibilities: ["警備員の勤怠管理・給与計算", "採用の事務と、入社手続き", "契約書・請求書の管理"],
        requirements: ["総務・人事・経理のいずれかの実務経験（2年以上）", "基本的なPC操作（表計算など）"],
        preferred: ["警備業・サービス業での管理部門の経験", "社会保険・労務の知識"],
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
        role: "施設警備員（隊長） / 2019年 中途入社",
        quote: "「ありがとう」と言われる回数が、前の仕事とは比べものになりません。",
        body: "前職は営業でした。未経験でしたが、入社後の教育でひとつずつ学び、今は商業施設の現場で隊長を務めています。急病人への対応や迷子の保護など、人の役に立てる場面が毎日あります。資格取得の支援制度を使って、入社から3年で複数の資格を取りました。",
      },
      {
        initial: "M",
        color: "#1a7a8c",
        name: "M.S.",
        role: "交通誘導・雑踏警備員 / 2022年 新卒入社",
        quote: "大きなイベントが無事に終わったときの達成感は、何にも代えがたいです。",
        body: "学生時代に参加した花火大会の警備に憧れて入社しました。入社1年目は先輩と一緒に現場を回り、2年目からは雑踏警備の班を任されています。事前の打ち合わせで想定したことが、当日その通りに動いたときは、チームの力を感じます。",
      },
      {
        initial: "A",
        color: "#7d3c98",
        name: "A.N.",
        role: "管制センター員 / 2016年 中途入社",
        quote: "現場の隊員の「声」を受け止めて、すぐに動かす。それが私の役目です。",
        body: "24時間のセンターで、各現場からの連絡を受け、必要な指示を出しています。緊急の連絡のときこそ、落ち着いて正確に伝えることを心がけています。育児と両立できるよう、日勤中心のシフトにしてもらえたのも、働き続けられた大きな理由です。",
      },
    ],
  },

  benefits: {
    eyebrow: "BENEFITS",
    title: "福利厚生・制度",
    items: [
      { icon: "🏥", title: "各種社会保険完備" },
      { icon: "🌙", title: "夜勤手当・資格手当" },
      { icon: "📈", title: "資格取得支援制度" },
      { icon: "👔", title: "制服・装備の貸与" },
      { icon: "🌴", title: "年間休日110日以上" },
      { icon: "👶", title: "育児・介護休業制度" },
      { icon: "🎓", title: "新任教育・現任教育" },
      { icon: "🏠", title: "寮・社宅の制度（一部）" },
    ],
  },

  flow: {
    eyebrow: "FLOW",
    title: "選考フロー",
    note: "エントリーから内定まで、通常2〜4週間程度です。",
    items: [
      { step: "01", title: "エントリー", desc: "お問い合わせ先から必要事項をご連絡ください", duration: "随時" },
      { step: "02", title: "書類選考", desc: "履歴書（職務経歴書）を確認します", duration: "約1週間" },
      { step: "03", title: "面接（1〜2回）", desc: "現場責任者・人事と面談します。現場の見学も可", duration: "約1〜2週間" },
      { step: "04", title: "内定・新任教育", desc: "入社後に、法定の新任教育を受けてから現場に配属されます", duration: "入社後" },
    ],
  },

  cta: {
    title: "あなたの力を、現場で活かしませんか。",
    text: "まずはお気軽にエントリーください。",
    // よくある質問ページがある版（廉価版）だけ、text の後ろに続けて表示する
    faqText: "よくある質問もご覧いただけます。",
    button: "エントリーする",
    faq: "よくある質問を見る",
  },
};
