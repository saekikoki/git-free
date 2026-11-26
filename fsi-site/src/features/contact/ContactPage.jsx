import { useState } from "react";
import { Link } from "react-router-dom";
import PageHead from "../../components/layout/PageHead";
import profile from "../../content/company-profile";
// フル版: APIへPOST / 廉価版: メールソフトを起動（@edition/dataSource が切り替える）
import { submitContact } from "@edition/dataSource";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: "",
    message: "",
    agree: false,
  });
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState(""); // 完了画面の補足（廉価版: メールソフト起動の案内）

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!form.agree) {
      setStatus("個人情報保護方針に同意してください。");
      return;
    }

    setStatus("送信中...");

    try {
      const result = await submitContact({
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        category: form.category,
        message: form.message,
      });

      setNotice(result?.notice || "");
      setSubmitted(true);
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("エラーが発生しました。時間をおいて再度お試しください。");
    }
  };

  if (submitted) {
    return (
      <section className="contact-page">
        <div className="contact-thanks">
          <h2>お問い合わせありがとうございます</h2>
          {notice ? (
            <p>{notice}</p>
          ) : (
            <p>
              お問い合わせを受け付けました。<br />
              内容を確認のうえ、担当者よりご連絡いたします。<br />
              通常2〜3営業日以内にご返信いたします。
            </p>
          )}
          <Link to="/" className="contact-back-btn">トップページに戻る</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-page">
      <PageHead title="お問い合わせ" description="FSI-STYLE CORPへのお問い合わせフォームです。製品・サービスのご質問やお見積もりなど。" />
      <h2 className="contact-page-title">お問い合わせ</h2>
      <p className="contact-page-desc">
        製品・サービスに関するご質問、お見積もり、その他ご相談などお気軽にお問い合わせください。<br />
        <span className="contact-required-note"><span className="contact-required">*</span> は必須項目です</span>
      </p>

      <form className="contact-page-form" onSubmit={handleSubmit}>
        <label>
          <span>お名前 <span className="contact-required">*</span></span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="山田 太郎"
            required
          />
        </label>

        <label>
          <span>会社名・団体名</span>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="株式会社○○"
          />
        </label>

        <label>
          <span>メールアドレス <span className="contact-required">*</span></span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@company.co.jp"
            required
          />
        </label>

        <label>
          <span>電話番号</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="03-0000-0000"
          />
        </label>

        <label>
          <span>お問い合わせ種別 <span className="contact-required">*</span></span>
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">選択してください</option>
            <option value="製品・サービスについて">製品・サービスについて</option>
            <option value="お見積もり">お見積もり</option>
            <option value="採用について">採用について</option>
            <option value="パートナーシップ">パートナーシップ</option>
            <option value="その他">その他</option>
          </select>
        </label>

        <label>
          <span>お問い合わせ内容 <span className="contact-required">*</span></span>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="お問い合わせ内容をご記入ください"
            rows="6"
            required
          />
        </label>

        <div className="contact-agree">
          <label className="contact-agree-label">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <span>
              <Link to="/privacy" target="_blank">個人情報保護方針</Link>に同意する <span className="contact-required">*</span>
            </span>
          </label>
        </div>

        {status && <p className="contact-page-status">{status}</p>}

        <button type="submit" className="contact-page-submit" disabled={!form.agree}>
          送信する
        </button>
      </form>

      <div className="contact-other">
        <h3>お電話でのお問い合わせ</h3>
        {/* 電話番号と受付時間は src/content/company-profile.js で変更する */}
        <p className="contact-phone-number">{profile.phone}</p>
        <p className="contact-phone-hours">{profile.businessHours.ja}</p>
      </div>
    </section>
  );
}
