/**
 * SitemapPage.jsx - サイトマップ
 *
 * 表示するリンクはエディションごとの config.js（sitemap）で定義する。
 * フル版と廉価版で存在するページが違うため。
 * 英語ページでは headingEn / labelEn を表示する。
 */
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import { sitemap } from "@edition/config";

export default function Sitemap() {
  const lang = useLang();
  const t = useContent().legal.sitemap;
  const pick = (ja, en) => (lang === "en" && en) || ja;

  return (
    <section className="static-page">
      <PageHead title={t.title} description={t.description} />
      <h1 className="static-page-title">{t.title}</h1>

      <div className="static-page-content sitemap">
        {sitemap.map((group) => (
          <div key={group.heading} className="sitemap-group">
            <h2 className="static-page-h">{pick(group.heading, group.headingEn)}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.to}><Link to={link.to}>{pick(link.label, link.labelEn)}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
