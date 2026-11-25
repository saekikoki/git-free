/**
 * TermsPage.jsx - サイトのご利用について（/terms）
 * 文言は src/content/{ja,en}/legal.js の terms。
 */
import { useContent } from "../../content";
import LegalDocument from "./LegalDocument";

export default function Terms() {
  return <LegalDocument doc={useContent().legal.terms} />;
}
