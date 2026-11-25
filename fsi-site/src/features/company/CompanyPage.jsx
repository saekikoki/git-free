/**
 * CompanyPage.jsx - 会社概要ページ（ルート: /company）
 *
 * 会社概要・役員一覧を表示するページです。
 * 実際の表示内容は CompanyOverview コンポーネントが担当します。
 */
import CompanyOverview from "./CompanyOverview";

export default function CompanyPage() {
  return <CompanyOverview />;
}
