/**
 * boot.js - 画面を表示する前の準備（フル版）
 *
 * 文言ファイル（src/content/ja/*.js）は分けて出力されるので、画面を作る前にすべて読み込む。
 * フル版は日本語だけなので、日本語の文言だけを読み込む。
 */
import { loadContent } from "../../content";

export function preload() {
  return loadContent("ja").catch(console.error);
}

/** 表示後に、ほかのページのプログラムを先読みする（フル版は最初にすべて読み込むので不要） */
export function prefetchPages() {}
