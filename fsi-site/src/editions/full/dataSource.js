/**
 * フル版のデータ取得
 *
 * ニュースとお問い合わせは API（ローカル: Express / 本番: API Gateway）を呼ぶ。
 * 共通ページはこのファイルの関数だけを使うので、廉価版と差し替えられる。
 */

// 「待たずにすぐ返す」取得は廉価版（事前HTML化）用。フル版はAPIを待つので使わない
export const getNewsListSync = null;
export const getNewsItemSync = null;

// ニュース一覧（新しい順）
export async function fetchNewsList() {
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error("ニュースの取得に失敗しました");
  return res.json();
}

// ニュース1件
export async function fetchNewsItem(sk) {
  const res = await fetch(`/api/news/${sk}`);
  if (!res.ok) throw new Error("ニュースが見つかりません");
  return res.json();
}

// お問い合わせ送信。戻り値の notice は完了画面に表示する補足（なければ null）
export async function submitContact(form) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error("送信に失敗しました");
  return { notice: null };
}
