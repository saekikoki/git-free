/**
 * Breadcrumb.jsx - パンくず（「トップ / 事業内容 / クラウド」のような現在位置の表示）
 *
 *   <Breadcrumb items={[{ name: "事業内容", to: "/services" }, { name: "クラウド" }]} />
 * 先頭の「トップ」は自動で付く。最後の項目（今のページ）は to を省略する。
 */
import { Fragment } from "react";
import Link from "../../i18n/LocalizedLink";
import { useContent } from "../../content";

export default function Breadcrumb({ items }) {
  const t = useContent().common;
  return (
    <nav className="corp-breadcrumb" aria-label={t.breadcrumbLabel}>
      <div className="corp-container">
        <Link to="/">{t.breadcrumbTop}</Link>
        {items.map((item) => (
          <Fragment key={item.name}>
            <span className="corp-sep" aria-hidden="true">/</span>
            {item.to ? <Link to={item.to}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
