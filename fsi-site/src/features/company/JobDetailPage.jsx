/**
 * JobDetailPage.jsx - 募集職種の詳細（/recruit/jobs/:slug/）
 *
 * Google の求人検索（Google しごと検索）に載せるための構造化データ（JobPosting）を出力する。
 * Google の決まりで、求人の構造化データは「1つの求人の詳細ページ」にだけ入れる。
 * 文言は src/content/{ja,en}/recruit.js の jobs。
 */
import { useParams } from "react-router-dom";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import Breadcrumb from "../../components/layout/Breadcrumb";
import { breadcrumbJsonLd, jobPostingJsonLd } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import { formatAddress } from "../../content/company-profile";
import { formatNewsDate } from "../news/newsUtils";
import NotFoundPage from "../errors/NotFoundPage";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function JobDetailPage() {
  const { slug } = useParams();
  const lang = useLang();
  const all = useContent();
  const t = all.recruit;
  const D = t.jobs.detail;
  const job = t.jobs.items.find((j) => j.slug === slug);
  if (!job) return <NotFoundPage />;

  const path = localizePath(`/recruit/jobs/${job.slug}`, lang);
  const location = formatAddress(all.profile, lang);
  const salary = job.salary ? D.salaryFormat(job.salary.min, job.salary.max) : "";
  const others = t.jobs.items.filter((j) => j.slug !== job.slug);

  // 求人の説明（Google の決まりで HTML の文章として渡す）
  const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  const descriptionHtml = [
    `<p>${esc(job.desc)}</p>`,
    `<p><strong>${esc(D.responsibilities)}</strong></p>${list(job.responsibilities)}`,
    `<p><strong>${esc(D.requirements)}</strong></p>${list(job.requirements)}`,
    job.preferred?.length ? `<p><strong>${esc(D.preferred)}</strong></p>${list(job.preferred)}` : "",
    job.workStyle ? `<p><strong>${esc(D.workStyle)}</strong></p><p>${esc(job.workStyle)}</p>` : "",
  ].join("");

  const rows = [
    { label: D.hiringType, value: job.types.join(" / ") },
    { label: D.employmentType, value: D.employmentTypes[job.employmentType] || job.employmentType },
    { label: D.location, value: location },
    salary && { label: D.salary, value: salary },
    job.workStyle && { label: D.workStyle, value: job.workStyle },
    { label: D.datePosted, value: formatNewsDate(job.datePosted, lang).full },
  ].filter(Boolean);

  return (
    <div className="corp job">
      <PageHead
        title={`${job.title} | ${t.title}`}
        description={`${job.title}（${job.types.join(" / ")}）: ${job.desc}`.replace(/（(.*)）/, lang === "en" ? " ($1)" : "（$1）")}
        jsonLd={[
          jobPostingJsonLd({ job, descriptionHtml, lang }),
          breadcrumbJsonLd([
            { name: all.common.breadcrumbTop, path: localizePath("/", lang) },
            { name: t.title, path: localizePath("/recruit", lang) },
            { name: job.title, path },
          ]),
        ]}
      />

      <section className="newsx-hero">
        <div className="corp-container">
          <p className="corp-hero-eyebrow">{t.jobs.eyebrow}</p>
          <span className="case-hero-industry">{job.category}</span>
          <h1 className="newsx-detail-title">{job.title}</h1>
          <p className="newsx-hero-lead">{job.desc}</p>
        </div>
      </section>

      <Breadcrumb items={[{ name: t.title, to: "/recruit" }, { name: job.title }]} />

      <section className="corp-section">
        <div className="corp-container svc-narrow">
          <h2 className="case-h2">{D.responsibilities}</h2>
          <ul className="svc-checklist">{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>

          <h2 className="case-h2">{D.requirements}</h2>
          <ul className="svc-checklist">{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul>

          {job.preferred?.length > 0 && (
            <>
              <h2 className="case-h2">{D.preferred}</h2>
              <ul className="svc-checklist">{job.preferred.map((r) => <li key={r}>{r}</li>)}</ul>
            </>
          )}

          <h2 className="case-h2">{D.conditions}</h2>
          <dl className="corp-profile">
            {rows.map((row) => (
              <div key={row.label} className="corp-profile-row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="job-apply">
            <h2 className="job-apply-title">{D.applyTitle}</h2>
            <p>{D.applyText}</p>
            <Link to="/contact" className="hero-v2-btn hero-v2-btn-primary">{D.applyButton}</Link>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="corp-section corp-section--gray">
          <div className="corp-container">
            <div className="corp-section-head"><h2 className="corp-h2">{D.otherJobs}</h2></div>
            <div className="recruit-jobs">
              {others.map((j) => (
                <article key={j.slug} className="recruit-job-card">
                  <span className="recruit-job-cat">{j.category}</span>
                  <h3 className="recruit-job-title"><Link to={`/recruit/jobs/${j.slug}`}>{j.title}</Link></h3>
                  <p className="recruit-job-desc">{j.desc}</p>
                  <div className="recruit-job-footer">
                    <span className="recruit-job-type">{j.types.join(" / ")}</span>
                    <span className="recruit-job-link" aria-hidden="true">{t.jobs.apply}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="news-more">
              <Link to="/recruit" className="news-more-btn">{D.back}</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
