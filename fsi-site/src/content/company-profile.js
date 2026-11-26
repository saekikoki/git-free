/**
 * company-profile.js - 会社の基本情報（★ 公開前に、実際の会社の情報に書き換えるファイル）
 *
 * 社名・住所・電話番号・メールアドレス・代表者・SNS などは、すべてこのファイルにまとめている。
 * ここを書き換えると、次の場所に自動で反映される。
 *   - ヘッダー・フッターのロゴ、著作権表示、ページのタイトル（サイト名）
 *   - 企業情報ページ（会社概要・アクセス・地図）
 *   - お問い合わせページ、個人情報保護方針の窓口、よくある質問の所在地
 *   - 検索エンジン向けの会社情報（構造化データ）、求人情報の勤務地
 *
 * 現在の値は、すべて架空のサンプルです（実在の会社・住所・人物とは関係ありません）。
 * 日本語（ja）と英語（en）の両方がある項目は、両方を書き換えてください。
 */
export default {
  // サイト名（ブラウザのタブ・検索結果・SNS で表示される名前）
  siteName: "FSI-STYLE CORP",
  // ロゴの文字（main は白、accent は水色で表示）
  brand: { main: "FSI-STYLE", accent: "CORP" },
  // 文中で使う短い呼び名（例: 「FSI-STYLEは、…」）
  shortName: { ja: "FSI-STYLE", en: "FSI-STYLE" },
  // 正式な社名（会社概要・著作権表示・構造化データ）
  legalName: { ja: "株式会社エフエスアイスタイル", en: "FSI-STYLE Corporation" },

  representative: {
    ja: { title: "代表取締役社長", name: "山田 太郎" },
    en: { title: "President & CEO", name: "Taro Yamada" },
  },

  // 設立日（YYYY-MM-DD）。会社概要の表示と構造化データに使う
  foundingDate: "1995-04-01",
  capital: { ja: "1億円", en: "100 million yen" },
  employees: { ja: "1,200名（2025年4月時点）", en: "1,200 (as of April 2025)" },

  // 所在地。street / locality / region / postalCode は検索エンジン向けの住所の部品
  address: {
    postalCode: "100-0000",
    region: { ja: "東京都", en: "Tokyo" },
    locality: { ja: "千代田区", en: "Chiyoda-ku" },
    street: { ja: "サンプル町1-2-3 サンプルビル10階", en: "10F Sample Bldg., 1-2-3 Sample-cho" },
    country: "JP",
  },
  // 地図で表示する場所（Google マップで検索する文字列。住所や建物名を入れる）
  mapQuery: "東京駅",
  // 最寄り駅からの道順
  routes: {
    ja: ["JR「東京駅」丸の内北口より徒歩5分（サンプル）", "東京メトロ「大手町駅」より徒歩3分（サンプル）"],
    en: ["5 min walk from Marunouchi North Exit, JR Tokyo Station (sample)", "3 min walk from Otemachi Station, Tokyo Metro (sample)"],
  },

  // 連絡先（お問い合わせページ・個人情報保護方針・構造化データ）
  email: "info@example.com",
  privacyEmail: "privacy@example.com",
  phone: "03-0000-0000",
  // 海外向けの電話番号表記（英語ページで使う）
  phoneIntl: "+81-3-0000-0000",
  businessHours: {
    ja: "受付時間: 平日 9:00〜17:30（土日祝日を除く）",
    en: "Hours: Weekdays 9:00-17:30 JST (except weekends and Japanese holidays)",
  },

  // SNS の URL（https:// から書く）。空のものはフッターに表示しない
  sns: {
    x: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  },
};

// ---- ここから下は、上の情報を組み立てる関数（通常は編集不要） ----

/** 表示用の住所（例: 〒100-0000 東京都千代田区サンプル町1-2-3 …） */
export function formatAddress(profile, lang) {
  const a = profile.address;
  if (lang === "en") {
    return `${a.street.en}, ${a.locality.en}, ${a.region.en} ${a.postalCode}, Japan`;
  }
  return `〒${a.postalCode} ${a.region.ja}${a.locality.ja}${a.street.ja}`;
}

/** 設立日の表示（例: 1995年4月1日 / April 1, 1995） */
export function formatFoundingDate(profile, lang) {
  const [y, m, d] = profile.foundingDate.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return lang === "en" ? `${months[m - 1]} ${d}, ${y}` : `${y}年${m}月${d}日`;
}

/** 設立年（例: "1995"） */
export function foundingYear(profile) {
  return profile.foundingDate.slice(0, 4);
}
