/**
 * ContactPage.jsx - 廉価版のお問い合わせページ
 *
 * フォームは持たず、受付用のメールアドレスと電話番号を案内するだけのページ。
 * （サーバーがない廉価版では、フォーム内容を保存・送信できないため）
 * メールアドレス・電話番号・受付時間は src/content/company-profile.js、
 * 文言は src/content/{ja,en}/contact.js で変更する。
 */
import { useState } from "react";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import Breadcrumb from "../../components/layout/Breadcrumb";
import Lines from "../../components/ui/Lines";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import profile from "../../content/company-profile";
import { FEATURES } from "./config";

export default function ContactPage() {
  const lang = useLang();
  const t = useContent().contact;
  const [copied, setCopied] = useState(false);
  const email = profile.email;
  const phone = lang === "en" ? profile.phoneIntl : profile.phone;

  // アドレスをクリップボードにコピー（メールソフトを使わない人向け）
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // コピーできない環境では何もしない（アドレスは画面に表示されている）
    }
  };

  return (
    <>
      <Breadcrumb items={[{ name: t.title }]} />
      <section className="contact-page">
        <PageHead title={t.title} description={t.description} />
        <h1 className="contact-page-title">{t.title}</h1>
        <p className="contact-page-desc"><Lines text={t.lead} /></p>

        <div className="contact-mail-card">
          <p className="contact-mail-label">{t.mailLabel}</p>
          <a className="contact-mail-address" href={`mailto:${email}`}>
            {email}
          </a>
          <div className="contact-mail-actions">
            <a className="contact-mail-btn contact-mail-btn-primary" href={`mailto:${email}`}>
              {t.mailButton}
            </a>
            <button type="button" className="contact-mail-btn" onClick={copyEmail}>
              {copied ? t.copied : t.copyButton}
            </button>
          </div>
        </div>

        <div className="contact-other">
          <h2 className="contact-other-h">{t.phoneHeading}</h2>
          <p className="contact-phone-number">
            <a href={`tel:${profile.phoneIntl.replace(/[^\d+]/g, "")}`}>{phone}</a>
          </p>
          <p className="contact-phone-hours">{profile.businessHours[lang] || profile.businessHours.ja}</p>
        </div>

        <div className="contact-other">
          <h2 className="contact-other-h">{t.hintHeading}</h2>
          <p className="contact-mail-hint"><Lines text={t.hint} /></p>
        </div>

        {FEATURES.faq && (
          <div className="contact-faq">
            <p>{t.faqLead}</p>
            <Link to="/faq" className="contact-mail-btn">{t.faqButton}</Link>
          </div>
        )}
      </section>
    </>
  );
}
