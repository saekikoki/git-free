/**
 * LazyPage.jsx - ページのプログラムと文言を読み込んでから表示する部品（廉価版）
 *
 * 読み込み済み（ページを最初に開いたとき・事前HTML化のとき）は、すぐにそのページを表示する。
 * 画面遷移で初めて開くページは、読み込みが終わるまで空の枠を表示する（通常は一瞬）。
 *
 *   entry   … pageEntries.js の読み込み口（プログラム）
 *   content … そのページで使う文言ファイルの名前（routes.js の content）
 *   props   … ページに渡す値
 */
import { createElement, useEffect, useState } from "react";
import { useLang } from "../../i18n/lang";
import { hasContent, loadContent } from "../../content";

const NONE = [];

export default function LazyPage({ entry, content = NONE, props }) {
  const lang = useLang();
  const [, setTick] = useState(0);
  const ready = Boolean(entry.Component) && hasContent(lang, content);

  useEffect(() => {
    if (ready) return;
    let alive = true;
    Promise.all([entry.load(), loadContent(lang, content)])
      .then(() => alive && setTick((n) => n + 1))
      .catch(console.error);
    return () => { alive = false; };
  }, [ready, entry, lang, content]);

  if (!ready) return <div className="page-loading" aria-busy="true" />;
  return createElement(entry.Component, props);
}
