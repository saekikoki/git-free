/**
 * Lines.jsx - 文字列の「\n」を改行（<br />）にして表示する
 *
 * 文言ファイル（src/content）では改行を「\n」で書いている。
 *   <Lines text={"1行目\n2行目"} />
 */
import { Fragment } from "react";

export default function Lines({ text = "" }) {
  const lines = String(text).split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}
