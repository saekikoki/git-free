// vite.config.js
//
// ビルドするエディション（版）を --mode で切り替える。
//   --mode lite      → 廉価版（src/editions/lite）。DB・API不要、S3静的ホスティング用
//   それ以外（既定） → フル版（src/editions/full）。API Gateway + Lambda + DynamoDB
//
// ソース中の `@edition/...` は、選ばれたエディションのフォルダに解決される。
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * 廉価版だけ、index.html の <head> の先頭に「表示テーマ（ライト/ダーク）」を決める短い処理を入れる。
 * 画面が表示される前に実行するので、白い画面が一瞬見える（ちらつく）のを防げる。
 *   1. 以前に自分で切り替えたことがあれば、その設定（localStorage）
 *   2. なければ、端末の設定（ダークモードかどうか）
 */
function liteThemePlugin() {
  const script =
    "(function(){try{var t=localStorage.getItem('fsi-theme');" +
    "if(!t){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}" +
    "document.documentElement.dataset.theme=t}catch(e){}})();";
  return {
    name: "lite-theme",
    transformIndexHtml() {
      return [
        { tag: "meta", attrs: { name: "color-scheme", content: "light dark" }, injectTo: "head-prepend" },
        { tag: "script", children: script, injectTo: "head-prepend" },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  // mode に応じた .env ファイルを読み込む
  const env = loadEnv(mode, process.cwd(), "");

  const edition = mode === "lite" ? "lite" : "full";
  const apiTarget = env.VITE_API_TARGET || "http://localhost:3001";

  return {
    plugins: [react(), ...(edition === "lite" ? [liteThemePlugin()] : [])],
    resolve: {
      alias: {
        "@edition": path.resolve(rootDir, `src/editions/${edition}`),
      },
    },
    build: {
      // フル版は dist/、廉価版は dist-lite/ に出力（両方を同時に保持できる）
      // （事前HTML化用のビルドは package.json の build:lite で --outDir .ssr-lite を指定）
      outDir: edition === "lite" ? "dist-lite" : "dist",
    },
    ssr: {
      // CommonJS 形式のライブラリは、事前HTML化用のファイルにまとめて取り込む
      noExternal: ["react-router-hash-link"],
    },
    server: {
      // 廉価版はAPIを使わないのでプロキシ不要
      proxy: edition === "lite" ? undefined : {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
