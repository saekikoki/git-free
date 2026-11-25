/**
 * useReveal.js - 要素が画面に入ったら true になるフック
 *
 *   const [ref, visible] = useReveal();
 *   <div ref={ref} className={visible ? "is-visible" : ""}>...</div>
 *
 * 事前HTML化したページでも中身（文字）はHTMLに入っているので、検索エンジンは読める。
 */
import { useEffect, useRef, useState } from "react";

export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // 一度表示したら監視をやめる
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
