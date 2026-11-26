/**
 * newsUtils.js - ニュース・コラムの画面で共通に使う関数
 *
 * kind は "news"（ニュースリリース）か "columns"（コラム。廉価版のみ）。
 */
import { useEffect, useState } from "react";
import {
  fetchNewsList,
  fetchNewsItem,
  getNewsListSync,
  getNewsItemSync,
  getNewsBodySync,
  loadNewsBody,
} from "@edition/dataSource";

/**
 * 日付を表示用に分解する。
 * "2025-07-01" のような日付だけの文字列は、タイムゾーンの影響を受けないよう文字列から直接読む
 * （事前HTML化したときとブラウザで表示したときに日付がずれないようにするため）。
 */
export function formatNewsDate(value, lang = "ja") {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || "");
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
 * 英語ページで英語版（.en.md）があれば英語の見出し・要約に差し替える。
 * 英語版がなければ日本語のまま返し、jaOnly: true を付ける。
 */
export function localizeNews(item, lang) {
  if (!item) return item;
  if (lang !== "en") return item;
  if (!item.en) return { ...item, jaOnly: true };
  return { ...item, ...item.en, jaOnly: false };
}

/** 一覧ページのパス */
export function listPath(kind = "news") {
  return kind === "columns" ? "/columns/" : "/news/";
}

/**
 * 記事ページのパス（言語つき）。
 * 英語版のない記事は英語ページを作っていないので、英語ページからも日本語のページへリンクする。
 */
export function newsPath(item, lang, kind = "news") {
  const base = kind === "columns" ? "/columns" : "/news";
  return lang === "en" && item.en ? `/en${base}/${item.SK}/` : `${base}/${item.SK}/`;
}

/** 表示用のカテゴリ名（英語ページでは英語名に置き換える） */
export function categoryLabel(category, t) {
  return (t.common.news.categories || {})[category] || category;
}

/** ニュースとコラムで文言を切り替える（コラムにない文言はニュースのものを使う） */
export function newsTexts(t, kind = "news") {
  return kind === "columns" ? { ...t.common.news, ...t.common.columns } : t.common.news;
}

/**
 * 一覧を取得するフック。
 * 廉価版はすぐに手元のデータを返し、フル版は API の応答を待つ。
 */
export function useNewsList(kind = "news") {
  const [news, setNews] = useState(() => (getNewsListSync ? getNewsListSync(kind) : []));
  useEffect(() => {
    if (getNewsListSync) return; // 廉価版は取得済み
    fetchNewsList(kind).then(setNews).catch(console.error);
  }, [kind]);
  return getNewsListSync ? getNewsListSync(kind) : news;
}

/**
 * 1件を取得するフック。戻り値は { article, bodyReady, error }。
 *   article が undefined … 読み込み中（フル版）
 *   error が "not-found" … 見つからない
 *   bodyReady が false   … 見出しは出せるが本文はまだ（廉価版で、記事を開いた直後）
 * article は日本語の情報。英語に合わせるのは localizeNews で行う。
 */
export function useNewsItem(sk, kind = "news", lang = "ja") {
  const isLite = Boolean(getNewsItemSync);
  const [, setTick] = useState(0);
  const [remote, setRemote] = useState({ sk: null, article: undefined, error: "" });

  const meta = isLite ? getNewsItemSync(sk, kind) : null;
  const body = isLite && meta ? getNewsBodySync(sk, kind, lang) : null;

  useEffect(() => {
    let alive = true;
    if (isLite) {
      // 本文がまだなら読み込んで、表示し直す
      if (meta && !getNewsBodySync(sk, kind, lang)) {
        loadNewsBody(sk, kind, lang).then(() => alive && setTick((n) => n + 1)).catch(console.error);
      }
    } else {
      fetchNewsItem(sk)
        .then((article) => alive && setRemote({ sk, article, error: "" }))
        .catch(() => alive && setRemote({ sk, article: null, error: "not-found" }));
    }
    return () => { alive = false; };
  }, [isLite, meta, sk, kind, lang]);

  if (isLite) {
    if (!meta) return { article: null, bodyReady: false, error: "not-found" };
    return { article: { ...meta, html: body?.html, text: body?.text }, bodyReady: Boolean(body), error: "" };
  }
  if (remote.sk !== sk) return { article: undefined, bodyReady: false, error: "" };
  return { article: remote.article, bodyReady: Boolean(remote.article), error: remote.error };
}
