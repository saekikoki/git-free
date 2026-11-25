/**
 * 廉価版のデータ取得
 *
 * サーバーを使わない。
 *   - ニュース: src/editions/lite/news/*.md をビルド時に取り込んで返す（newsLoader.js）
 *
 * getNewsListSync / getNewsItemSync は「待たずにすぐ返す」版。
 * ページを事前にHTML化（プリレンダリング）するとき、記事の中身をHTMLに含めるために使う。
 * フル版はAPIから取るので、この2つは null になっている。
 *
 * お問い合わせはフォームではなくメールアドレスの案内ページ（./ContactPage.jsx）なので、
 * 送信処理（submitContact）は持たない。
 */
import { articles } from "./newsLoader";

export function getNewsListSync() {
  return articles;
}

export function getNewsItemSync(sk) {
  return articles.find((n) => n.SK === sk) || null;
}

export async function fetchNewsList() {
  return articles;
}

export async function fetchNewsItem(sk) {
  const item = getNewsItemSync(sk);
  if (!item) throw new Error("ニュースが見つかりません");
  return item;
}
