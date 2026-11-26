/**
 * HeaderTools.jsx - 廉価版のヘッダー右端の部品
 *
 *   🔍 サイト内検索へ / 🌙 ダークモード切り替え / EN・JP 言語切り替え
 *
 * ※ config.js から読み込まれるので、このファイルからは config.js を読み込まないこと
 *   （お互いに読み込み合うと動かなくなる）。
 */
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { langFromPath, localizePath, stripLang } from "../../i18n/lang";
import { getContent } from "../../content";
import useHydrated from "../../components/ui/useHydrated";
import { collections } from "./newsLoader";

const THEME_KEY = "fsi-theme";

/** 今の表示テーマ（index.html の先頭のスクリプトが、表示前に <html data-theme> を設定している） */
function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function ThemeToggle({ t }) {
  const hydrated = useHydrated();
  const [theme, setTheme] = useState(null);
  const shown = theme || (hydrated ? currentTheme() : "light");

  // OS の設定が変わったら追従する（自分で切り替えたことがない場合だけ）
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e) => {
      if (localStorage.getItem(THEME_KEY)) return;
      const next = e.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = shown === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* 保存できなくても切り替えは行う */ }
    setTheme(next);
  };

  const isDark = shown === "dark";
  return (
    <button
      type="button"
      className="header-tool header-tool-theme"
      onClick={toggle}
      aria-label={isDark ? t.themeToLight : t.themeToDark}
      title={isDark ? t.themeToLight : t.themeToDark}
    >
      <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
    </button>
  );
}

export default function HeaderTools({ onNavigate }) {
  const { pathname, search } = useLocation();
  const lang = langFromPath(pathname);
  const t = getContent(lang).common.header;

  // 言語切り替え先: 今と同じページの、もう一方の言語
  // （404 ページから切り替えたときは、もう一方の言語のトップへ）
  // （英語版のない記事から EN を押したときは、英語の一覧ページへ）
  const base = stripLang(pathname);
  const otherLang = lang === "en" ? "ja" : "en";
  const article = base.match(/^\/(news|columns)\/([^/]+)\/?$/);
  let otherPath = localizePath(base, otherLang) + search;
  if (base === "/404" || base === "/404/") otherPath = localizePath("/", otherLang);
  else if (article && otherLang === "en" && !collections[article[1]]?.get(article[2])?.en) {
    otherPath = localizePath(`/${article[1]}`, "en");
  }

  return (
    <div className="header-tools">
      <Link
        to={localizePath("/search", lang)}
        className="header-tool header-tool-search"
        aria-label={t.search}
        title={t.search}
        onClick={onNavigate}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Link>
      <ThemeToggle t={t} />
      <Link
        to={otherPath}
        className="header-tool header-tool-lang"
        hrefLang={otherLang}
        lang={otherLang}
        aria-label={t.langSwitchLabel}
        title={t.langSwitchLabel}
        onClick={onNavigate}
      >
        {t.langSwitch}
      </Link>
    </div>
  );
}
