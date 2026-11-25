/**
 * LegalDocument.jsx - 規約系ページ（個人情報保護方針・利用規約）の共通レイアウト
 *
 * 文言は src/content/{ja,en}/legal.js の sections を順番に表示する。
 */
import PageHead from "../../components/layout/PageHead";
import Lines from "../../components/ui/Lines";

export default function LegalDocument({ doc }) {
  return (
    <section className="static-page">
      <PageHead title={doc.title} description={doc.description} />
      <h1 className="static-page-title">{doc.title}</h1>

      <div className="static-page-content">
        {doc.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="static-page-h">{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.list && (
              <ul>
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
            {s.contact && (
              <p className="static-page-contact"><Lines text={s.contact} /></p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
