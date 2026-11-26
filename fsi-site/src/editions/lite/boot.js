/**
 * boot.js - 画面を表示する前の準備（廉価版）
 *
 * 事前HTML化したページは、HTML の中身と同じ画面をブラウザで作り直してから動き出す（ハイドレーション）。
 * そのため、開いたページのプログラム・文言と、記事ページなら本文を、先に読み込んでおく。
 * （HTML は表示済みなので、待っている間も画面は見えている）
 */
import { matchPath } from "react-router-dom";
import { PAGE_PATHS, enPath } from "./routes";
import { PAGE_ENTRIES } from "./pageEntries";
import { loadNewsBody } from "./dataSource";
import { langFromPath } from "../../i18n/lang";
import { loadContent } from "../../content";

export function preload(pathname) {
  const lang = langFromPath(pathname);
  for (const page of PAGE_PATHS) {
    const pattern = lang === "en" ? enPath(page.path) : page.path;
    const match = matchPath({ path: pattern, end: true }, pathname);
    if (!match) continue;
    const tasks = [PAGE_ENTRIES[page.path].load(), loadContent(lang, page.content || [])];
    if (page.collection && match.params.sk) {
      tasks.push(loadNewsBody(match.params.sk, page.collection, lang).catch(() => {}));
    }
    return Promise.all(tasks).catch(console.error);
  }
  return Promise.resolve(); // 一覧にないURL（404）
}

/**
 * 表示が終わったあと、手が空いているときに、ほかのページのプログラムと文言も読み込んでおく。
 * 次にリンクを押したとき、待たずに表示できる。
 */
export function prefetchPages() {
  const lang = langFromPath(window.location.pathname);
  const run = () => {
    Object.values(PAGE_ENTRIES).forEach((entry) => entry.load().catch(() => {}));
    loadContent(lang).catch(() => {});
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 5000 });
  else setTimeout(run, 3000);
}
