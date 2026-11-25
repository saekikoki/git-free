/**
 * newsUtils.js - ニュース画面で共通に使う小さな関数
 */
import { useEffect, useState } from "react";
import {
  fetchNewsList,
  fetchNewsItem,
  getNewsListSync,
  getNewsItemSync,
} from "@edition/dataSource";

/**
 * 日付を表示用に分解する。
 * "2025-07-01" のような日付だけの文字列は、タイムゾーンの影響を受けないよう文字列から直接読む
 * （事前HTML化したときとブラウザで表示したときに日付がずれないようにするため）。
 */
export function formatNewsDate(value, lang = "ja") {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  let y, mo, d;
  if (m) {
    [, y, mo, d] = m.map(Number);
  } else {
    const dt = new Date(value);
    y = dt.getFullYear(); mo = dt.getMonth() + 1; d = dt.getDate();
  }
  const pad = (n) => String(n).padStart(2, "0");
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return {
    year: y,
    md: lang === "en" ? `${monthsEn[mo - 1]} ${pad(d)}` : `${pad(mo)}/${pad(d)}`,
    full: lang === "en" ? `${monthsEn[mo - 1]} ${d}, ${y}` : `${y}年${mo}月${d}日`,
    iso: `${y}-${pad(mo)}-${pad(d)}`,
  };
}

/**
 * 記事を表示中の言語に合わせる。
 * 英語ページで英語版（.en.md）があれば英語の見出し・本文に差し替える。
 * 英語版がなければ日本語のまま表示し、jaOnly: true を付ける。
 */
export function localizeNews(item, lang) {
  if (!item) return item;
  if (lang !== "en") return item;
  if (!item.en) return { ...item, jaOnly: true };
  return { ...item, ...item.en, jaOnly: false };
}

/** 表示用のカテゴリ名（英語ページでは英語名に置き換える） */
export function categoryLabel(category, t) {
  return (t.common.news.categories || {})[category] || category;
}

/**
 * ニュース一覧を取得するフック。
 * 廉価版はすぐに手元のデータを返し、フル版は API の応答を待つ。
 */
export function useNewsList() {
  const [news, setNews] = useState(() => (getNewsListSync ? getNewsListSync() : []));
  useEffect(() => {
    if (getNewsListSync) return; // 廉価版は取得済み
    fetchNewsList().then(setNews).catch(console.error);
  }, []);
  return news;
}

/**
 * ニュース1件を取得するフック。戻り値は { article, error }。
 * article が undefined の間は読み込み中。null なら見つからなかった。
 */
export function useNewsItem(sk) {
  const [state, setState] = useState(() => {
    if (!getNewsItemSync) return { sk, article: undefined, error: "" };
    const item = getNewsItemSync(sk);
    return { sk, article: item, error: item ? "" : "not-found" };
  });

  useEffect(() => {
    if (getNewsItemSync) return;
    let alive = true;
    fetchNewsItem(sk)
      .then((article) => alive && setState({ sk, article, error: "" }))
      .catch(() => alive && setState({ sk, article: null, error: "not-found" }));
    return () => { alive = false; };
  }, [sk]);

  // 廉価版で記事を移動したとき（関連記事のリンクなど）は、その場で取り直す
  if (getNewsItemSync && state.sk !== sk) {
    const item = getNewsItemSync(sk);
    return { article: item, error: item ? "" : "not-found" };
  }
  return state;
}
