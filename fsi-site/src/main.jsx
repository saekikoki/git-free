/**
 * main.jsx - アプリケーションのエントリポイント（起動ファイル）
 *
 * `@edition/App` はビルド時に選んだエディションの App に解決される（vite.config.js 参照）。
 *   npm run dev / build       → src/editions/full/App.jsx（フル版）
 *   npm run dev:lite / build:lite → src/editions/lite/App.jsx（廉価版）
 *
 * 廉価版はビルド時にページを事前にHTML化している。
 * HTML に中身が入っていれば、それを引き継いで動かす（hydrateRoot）。
 * 中身がなければ（開発サーバーやフル版）、ゼロから描画する（createRoot）。
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import App from "@edition/App";

const container = document.getElementById("root");

// 事前HTML化のときに <head> に入れたタイトル等（data-pre 付き）は、
// React が同じものを入れ直すので先に消しておく（二重にならないように）
document.querySelectorAll("head [data-pre]").forEach((el) => el.remove());

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
