/**
 * LocalizedLink.jsx - 現在の言語に合わせてリンク先を切り替える <Link>
 *
 * 英語ページ（/en/...）の中では、to="/company" が自動で "/en/company" になる。
 * 使い方は react-router-dom の <Link> と同じ。
 */
import { Link } from "react-router-dom";
import { localizePath, useLang } from "./lang";

export default function LocalizedLink({ to, ...props }) {
  const lang = useLang();
  return <Link to={localizePath(to, lang)} {...props} />;
}
