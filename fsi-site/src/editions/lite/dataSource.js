/**
 * 廉価版のデータ取得
 *
 * サーバーを使わない。
 *   - ニュース: src/editions/lite/news/*.md
 *   - コラム:   src/editions/lite/columns/*.md
 * を、ビルド時に取り込んで返す（newsLoader.js）。
 *
 * kind は "news"（ニュース）か "columns"（コラム）。
 * 「〜Sync」はすぐに返す版。事前HTML化（プリレンダリング）や、画面の最初の表示で使う。
 * 本文は記事を開くときに読み込む（loadNewsBody）。
 *
 * お問い合わせはフォームではなくメールアドレスの案内ページ（./ContactPage.jsx）なので、
 * 送信処理（submitContact）は持たない。
 */
import { collections } from "./newsLoader";

const col = (kind = "news") => collections[kind] || collections.news;

/** 一覧（見出し・日付・カテゴリ・要約。本文は含まない） */
export function getNewsListSync(kind = "news") {
  return col(kind).items;
}

/** 1件の一覧用の情報（なければ null） */
export function getNewsItemSync(sk, kind = "news") {
  return col(kind).get(sk);
}

/** 読み込み済みの本文 { html, text }（まだなら null） */
export function getNewsBodySync(sk, kind = "news", lang = "ja") {
  return col(kind).getBody(sk, lang);
}

/** 本文を読み込む */
export function loadNewsBody(sk, kind = "news", lang = "ja") {
  return col(kind).loadBody(sk, lang);
}

/** すべての記事の本文を読み込む（サイト内検索・事前HTML化で使う） */
export function loadAllNewsBodies(kind = "news", lang = "ja") {
  return col(kind).loadAll(lang);
}

export async function fetchNewsList(kind = "news") {
  return getNewsListSync(kind);
}

export async function fetchNewsItem(sk, kind = "news") {
  const item = getNewsItemSync(sk, kind);
  if (!item) throw new Error("記事が見つかりません");
  const body = await loadNewsBody(sk, kind);
  return { ...item, ...body };
}
