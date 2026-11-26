/**
 * main.jsx - アプリケーションのエントリポイント（起動ファイル）
 *
 * `@edition/App` はビルド時に選んだエディションの App に解決される（vite.config.js 参照）。
 *   npm run dev / build       → src/editions/full/App.jsx（フル版）
 *   npm run dev:lite / build:lite → src/editions/lite/App.jsx（廉価版）
 *
 * 廉価版はビルド時にページを事前にHTML化している。
 * HTML に中身が入っていれば、そのページのプログラムを読み込んでから引き継いで動かす（hydrateRoot）。
 * 中身がなければ（開発サーバーやフル版）、ゼロから描画する（createRoot）。
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import App from "@edition/App";
import { preload, prefetchPages } from "@edition/boot";
import { withTrailingSlash } from "./i18n/lang";

const container = document.getElementById("root");

// 事前HTML化した中身が「今開いている URL 用」かどうか。
// 存在しない URL に 404.html が返されたときなどは別の URL 用の中身なので、引き継がずに作り直す
const prerenderedFor = container.dataset.path;
const canHydrate =
  container.hasChildNodes() && (!prerenderedFor || prerenderedFor === withTrailingSlash(window.location.pathname));

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

preload(window.location.pathname).then(() => {
  // 事前HTML化のときに <head> に入れたタイトル等（data-pre 付き）は、
  // React が同じものを入れ直すので消しておく（二重にならないように）
  document.querySelectorAll("head [data-pre]").forEach((el) => el.remove());

  if (canHydrate) {
    ReactDOM.hydrateRoot(container, app);
  } else {
    container.textContent = "";
    ReactDOM.createRoot(container).render(app);
  }
  prefetchPages();
});
