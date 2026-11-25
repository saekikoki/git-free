/**
 * CountUp.jsx - 画面に入ったとき、数字を 0 から目標値までカウントアップ表示する
 *
 *   <CountUp value="1,200" />   → 0 → 1,200（カンマ区切りを保つ）
 *   <CountUp value="4.2" />     → 0.0 → 4.2（小数の桁数を保つ）
 *   <CountUp value="1970" plain /> → 年号などはカンマを付けない
 *
 * 事前レンダリングされたHTML（検索エンジンが読むもの）には最終値が入る。
 * 「視差効果を減らす」設定の端末では、アニメーションせずに最終値を表示する。
 */
import { useEffect, useRef, useState } from "react";

function parse(value) {
  const str = String(value);
  const num = Number(str.replace(/,/g, ""));
  const decimals = (str.split(".")[1] || "").length;
  return { num, decimals, hasComma: str.includes(",") };
}

function format(n, { decimals, hasComma }, plain) {
  const fixed = n.toFixed(decimals);
  if (plain || !hasComma) return fixed;
  const [int, dec] = fixed.split(".");
  return Number(int).toLocaleString("en-US") + (dec ? `.${dec}` : "");
}

export default function CountUp({ value, duration = 1400, plain = false }) {
  const info = parse(value);
  const ref = useRef(null);
  // アニメーション中の表示。value が変わったら（言語切り替えなど）最終値の表示に戻す
  const [anim, setAnim] = useState(null);
  const display = anim && anim.value === value ? anim.text : String(value);

  useEffect(() => {
    const el = ref.current;
    // 数値でないもの（例: "3倍"）はそのまま表示する
    if (!el || Number.isNaN(info.num)) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // 最後にゆっくり止まる動き
        setAnim({ value, text: format(info.num * eased, info, plain) });
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // value が変わったとき（言語切り替えなど）だけやり直す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
