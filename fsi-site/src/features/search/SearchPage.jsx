/**
 * SearchPage.jsx - サイト内検索（/search?q=キーワード、英語: /en/search）
 *
 * 入力した言葉でページとニュースを探し、該当箇所の前後の文章を表示する。
 * 検索語は URL（?q=）に残るので、結果をそのまま共有できる。
 */
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import useHydrated from "../../components/ui/useHydrated";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import { formatNewsDate } from "../news/newsUtils";
import { normalize, searchSite } from "./searchIndex";

/** 文章の中の検索語に <mark> を付けて目立たせる */
function Highlight({ text, words }) {
  if (!words.length) return text;
  const norm = normalize(text);
  // normalize で文字数が変わる文字（濁点の結合など）があると位置がずれるので、その場合は強調しない
  if (norm.length !== text.length) return text;
  const parts = [];
  let i = 0;
  while (i < text.length) {
    let hit = null;
    for (const w of words) {
      if (w && norm.startsWith(w, i) && (!hit || w.length > hit.length)) hit = w;
    }
    if (hit) {
      parts.push(<mark key={i}>{text.slice(i, i + hit.length)}</mark>);
      i += hit.length;
    } else {
      const last = parts[parts.length - 1];
      if (typeof last === "string") parts[parts.length - 1] = last + text[i];
      else parts.push(text[i]);
      i += 1;
    }
  }
  return parts;
}

export default function SearchPage() {
  const lang = useLang();
  const all = useContent();
  const t = all.search;
  const hydrated = useHydrated();
  const [params, setParams] = useSearchParams();
  const inputRef = useRef(null);

  // 事前HTML化したページには検索語がないので、ブラウザで引き継いだ後に URL の ?q= を使う
  const query = hydrated ? params.get("q") || "" : "";
  const words = useMemo(() => normalize(query).split(/\s+/).filter(Boolean), [query]);
  const results = useMemo(() => searchSite(query, lang), [query, lang]);

  // ページを開いたら入力欄にカーソルを置く
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onChange = (e) => {
    const value = e.target.value;
    setParams(value ? { q: value } : {}, { replace: true });
  };

  return (
    <div className="corp search-page">
      <PageHead title={t.title} description={t.description} noindex />

      <section className="newsx-hero">
        <div className="corp-container">
          <p className="corp-hero-eyebrow">{t.eyebrow}</p>
          <h1 className="newsx-hero-title">{t.title}</h1>
        </div>
      </section>

      <section className="corp-section">
        <div className="corp-container search-wrap">
          <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              ref={inputRef}
              type="search"
              className="search-input"
              value={query}
              onChange={onChange}
              placeholder={t.placeholder}
              aria-label={t.label}
            />
            <button type="submit" className="search-submit">{t.button}</button>
          </form>
          <p className="search-hint">{t.hint}</p>

          {query && (
            <p className="search-count" aria-live="polite">
              {results.length > 0 ? `${results.length} ${t.resultSuffix}` : t.noMatch}
            </p>
          )}

          <ul className="search-results">
            {results.map((r) => (
              <li key={r.url} className="search-result">
                <div className="search-result-meta">
                  <span className={`search-badge search-badge--${r.type}`}>
                    {r.type === "news" ? t.typeNews : t.typePage}
                  </span>
                  {r.date && <time dateTime={r.date}>{formatNewsDate(r.date, lang).full}</time>}
                </div>
                <Link to={r.url} className="search-result-title">
                  <Highlight text={r.title} words={words} />
                </Link>
                <p className="search-result-snippet"><Highlight text={r.snippet} words={words} /></p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
