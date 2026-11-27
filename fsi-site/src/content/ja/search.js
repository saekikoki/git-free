/**
 * サイト内検索ページの文言（日本語）
 */
import P from "../company-profile";

export default {
  title: "サイト内検索",
  description: `${P.siteName}サイト内のページ・ニュース・コラムを検索できます。`,
  eyebrow: "SEARCH",
  placeholder: "キーワードを入力（例: 施設警備、採用）",
  label: "サイト内を検索",
  button: "検索",
  hint: "ページの本文・ニュース・コラムから探します。スペースで区切ると、すべてを含む結果に絞り込みます。",
  resultSuffix: "件見つかりました",
  noMatch: "一致する結果がありませんでした。別のキーワードでお試しください。",
  loading: "検索の準備をしています...",
  typePage: "ページ",
  typeNews: "ニュース",
  typeColumns: "コラム",
  typeService: "事業内容",
  typeCase: "導入事例",
  typeJob: "募集職種",
  // 検索対象のページ名（検索結果に表示する）
  pages: {
    home: "トップページ",
    company: "企業情報",
    recruit: "採用情報",
    faq: "よくある質問",
    contact: "お問い合わせ",
    privacy: "個人情報保護への取り組み",
    terms: "サイトのご利用について",
  },
};
