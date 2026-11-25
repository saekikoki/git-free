/**
 * ScrollToTop.jsx - 2つの役割を持つ共通コンポーネント
 *
 * 1. ページ遷移（URL変更）のたびにスクロール位置を先頭に戻す
 * 2. ある程度スクロールすると右下に「トップへ戻る」ボタンを表示する
 */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useContent } from "../../content";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const label = useContent().common.scrollTop;
  const [visible, setVisible] = useState(false);

  // ページ遷移時に先頭へスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);

  // スクロール量に応じてボタン表示を切り替える
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={`scroll-top-btn ${visible ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={label}
    >
      ↑
    </button>
  );
}
