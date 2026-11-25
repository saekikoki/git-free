/**
 * lang.js - 表示言語（日本語 / 英語）の判定と、言語つきURLの作成
 *
 * 言語は URL で決まる。
 *   /company     → 日本語
 *   /en/company  → 英語
 *
 * フル版には /en のページがないので、常に日本語になる。
 */
import { useLocation } from "react-router-dom";

export const DEFAULT_LANG = "ja";
export const LANGS = ["ja", "en"];

/** URL のパスから言語を判定する */
export function langFromPath(pathname = "/") {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : DEFAULT_LANG;
}

/** 現在の言語（"ja" または "en"）を返すフック */
export function useLang() {
  const { pathname } = useLocation();
  return langFromPath(pathname);
}

/** パスから言語の接頭辞（/en）を取り除く。例: "/en/company" → "/company" */
export function stripLang(pathname = "/") {
  if (pathname === "/en" || pathname === "/en/") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

/**
 * 言語に合わせたパスを作る。
 *   localizePath("/company", "en") → "/en/company"
 *   localizePath("/#services", "en") → "/en#services"
 *   外部リンク（http...）や mailto: はそのまま返す
 */
export function localizePath(to, lang) {
  if (typeof to !== "string" || lang === DEFAULT_LANG) return to;
  if (/^(https?:|mailto:|tel:)/.test(to)) return to;
  if (to === "/" || to === "") return "/en";
  if (to.startsWith("/#")) return `/en${to.slice(1)}`;
  if (to.startsWith("/")) return `/en${to}`;
  return to;
}
