/**
 * 廉価版のお問い合わせページの文言（英語）。キーは ../ja/contact.js とそろえる。
 * メールアドレス・電話番号・受付時間は ../company-profile.js で設定する。
 */
import P from "../company-profile";

export default {
  title: "Contact",
  description: `Contact ${P.siteName} by email or phone about facility security, patrols, traffic control, event security, quotes or careers.`,
  lead: "For security consultations, quotes or job applications,\nplease contact us at the email address below.",
  mailLabel: "Email",
  mailButton: "Write an email",
  copyButton: "Copy address",
  copied: "Copied",
  phoneHeading: "Contact by phone",
  hintHeading: "Please include the following",
  hint: "Your name / Company or organization / Phone number / Type, place and date of security needed / Your inquiry\nWe usually reply within 2-3 business days.",
  faqLead: "Answers to common questions are available here.",
  faqButton: "View FAQ",
};
