/**
 * useLitePageEffects.js - 廉価版で、ページが切り替わるたびに行う処理
 *
 * 1. <html lang="ja|en"> を今のページの言語に合わせる（読み上げソフトや翻訳機能のため）
 * 2. スクロールに合わせたフェードイン
 *    画面の下のほうにある見出しやカードを、スクロールして見えたときにふわっと表示する。
 *    - 最初から画面内にあるものは対象外（ちらつかないように）
 *    - 「視差効果を減らす」設定の端末では何もしない
 *    - JavaScript が動かない環境では最初から全部表示される
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { langFromPath } from "../../i18n/lang";

// フェードインさせる要素（各画面の見出し・カードなど）
const REVEAL_SELECTOR = [
  ".corp-section-head",
  ".services-v2-head",
  ".section-heading",
  ".section-subheading",
  ".news-heading",
  ".stats-grid",
  ".showcase",
  ".corp-profile-row",
  ".corp-exec-card",
  ".corp-timeline-item",
  ".corp-access",
  ".recruit-interview",
  ".recruit-benefit",
  ".recruit-flow-item",
  ".recruit-cta .corp-container",
  ".faq-contact",
  ".svc-list-card",
  ".svc-feature",
  ".svc-process-step",
  ".svc-other",
  ".case-card",
  ".case-voice",
].join(",");

export default function useLitePageEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.lang = langFromPath(pathname);
  }, [pathname]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let observer;
    // 新しいページの描画が終わってから要素を探す
    const frame = requestAnimationFrame(() => {
      const root = document.documentElement;
      root.classList.add("motion-ready");
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-in");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      const fold = window.innerHeight;
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (el.getBoundingClientRect().top < fold) return; // 最初から見えているものはそのまま
        el.classList.add("reveal-target");
        observer.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);
}
