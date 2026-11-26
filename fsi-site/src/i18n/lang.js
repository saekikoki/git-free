/**
 * lang.js - 表示言語（日本語 / 英語）の判定と、言語つきURLの作成
 *
 * 言語は URL で決まる。
 *   /company/     → 日本語
 *   /en/company/  → 英語
 *
 * フル版には /en のページがないので、常に日本語になる。
 *
 * サイト内のURLは、末尾に「/」を付けた形（/company/）にそろえる。
 * 廉価版はページを /company/index.html として置いているので、
 * 「/」がないと S3 や CloudFront で転送が1回挟まり、検索エンジンからは別のURLに見えてしまうため。
 */
import { useLocation } from "react-router-dom";

export const DEFAULT_LANG = "ja";
export const LANGS = ["ja", "en"];

/** URL のパスから言語を判定する */
export function langFromPath(pathname = "/") {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : DEFAULT_LANG;
}

/** 現在の言語（ja か en）を返すフック */
export function useLang() {
  const { pathname } = useLocation();
  return langFromPath(pathname);
}

/** パスから言語の接頭辞（/en）を取り除く。例: "/en/company/" → "/company/" */
export function stripLang(pathname = "/") {
  if (pathname === "/en" || pathname === "/en/") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

/**
 * サイト内のパスの末尾に「/」を付ける。
 *   "/company"        → "/company/"
 *   "/news?year=2025" → "/news/?year=2025"
 *   "/feed.xml"       → そのまま（ファイルなので付けない）
 *   "https://..."     → そのまま
 */
export function withTrailingSlash(to) {
  if (typeof to !== "string" || !to.startsWith("/") || to.startsWith("//")) return to;
  const match = to.match(/^([^?#]*)(.*)$/);
  let path = match[1] || "/";
  const rest = match[2];
  const last = path.split("/").pop();
  if (!path.endsWith("/") && !/\.[a-z0-9]+$/i.test(last)) path += "/";
  return path + rest;
}

/**
 * 言語に合わせたパスを作る（末尾の「/」も付ける）。
 *   localizePath("/company", "en")   → "/en/company/"
 *   localizePath("/#services", "en") → "/en/#services"
 *   外部リンク（http...）や mailto: はそのまま返す
 */
export function localizePath(to, lang) {
  if (typeof to !== "string") return to;
  if (/^(https?:|mailto:|tel:)/.test(to)) return to;
  let path = to || "/";
  if (lang !== DEFAULT_LANG && path.startsWith("/") && !path.startsWith("//")) {
    path = path === "/" ? "/en" : path.startsWith("/#") ? `/en${path.slice(1)}` : `/en${path}`;
  }
  return withTrailingSlash(path);
}
