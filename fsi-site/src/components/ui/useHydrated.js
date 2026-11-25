/**
 * useHydrated.js - 「ブラウザでの表示準備が終わったか」を返すフック
 *
 * 廉価版はページを事前にHTML化している（プリレンダリング）。
 * そのHTMLとブラウザの最初の描画が食い違うと React が警告を出すため、
 * URLの ?q= や localStorage など「ブラウザでしか分からない値」は、
 * このフックが true になってから使う。
 *
 *   事前HTML化のとき / ブラウザでHTMLを引き継ぐ最初の1回 … false
 *   それ以降（画面遷移で新しく表示したときを含む）       … true
 */
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
