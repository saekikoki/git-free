/**
 * PrivacyPage.jsx - 個人情報保護への取り組み（/privacy）
 * 文言は src/content/{ja,en}/legal.js の privacy。
 */
import { useContent } from "../../content";
import LegalDocument from "./LegalDocument";

export default function Privacy() {
  return <LegalDocument doc={useContent().legal.privacy} />;
}
