// CompanyOverview.jsx
import React from "react";
import "./Companyf.css";

export default function CompanyOverview() {
  return (
    <div className="company-page">
      <nav className="append-breadcrumbs top-breadcrumbs" aria-label="現在位置">
        <ul id="breadcrumb">
          <li><a href="/index.html">トップページ</a></li>
          <li>・</li>
          <li><a href="/company.html">企業情報</a></li>
          <li>・</li>
          <li>採用情報</li>
        </ul>
      </nav>

      <header className="page-hero" role="banner">
        <div className="container">
          <h1 className="page-title">採用情報</h1>
        </div>
      </header>

      <main className="container" role="main">
        <section className="article-header">
          <div className="breadcrumbs">
            <ul>
              <li><a href="/index.html">トップページ</a></li>
              <li><a href="/company.html">会社情報</a></li>
              <li aria-current="page">会社概要／役員一覧</li>
            </ul>
          </div>
        </section>

        <section className="default-content">
          <h2 className="section-title">会社概要</h2>

          <div className="table-wrapper type-2">
            <div className="tablebox">
              <table className="company-table">
                <caption className="visually-hidden">会社概要</caption>
                <tbody>
                  <tr>
                    <th scope="row">会社名</th>
                    <td>
                      富士ソフト株式会社<br />
                      FUJI SOFT INCORPORATED<br />
                      当社株式は、2025年5月16日付で、株式会社東京証券取引所プライム市場において上場廃止となりました
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">本社所在地</th>
                    <td>
                      〒231-8008　神奈川県横浜市中区桜木町1-1<br />
                      <a href="https://maps.app.goo.gl/vXcnMNNC3EXeTV356" className="text-link" target="_blank" rel="noopener noreferrer">Google Map<span className="icon-external" aria-hidden="true"></span></a><br />
                      TEL：<a href="tel:0456508811">045-650-8811（大代表）</a><span className="sep">　</span>FAX：045-650-8810<br />
                      <a href="/company/network.html" className="text-link">国内外の拠点一覧はこちら<span className="icon-arrow" aria-hidden="true"></span></a><br />
                      お客様総合問い合わせ窓口　0120-593-111（フリーダイヤル）
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">創業</th>
                    <td>
                      1970年（昭和45年）5月15日<br />
                      <a href="/special/history.html" className="text-link">富士ソフトのあゆみはこちら<span className="icon-arrow" aria-hidden="true"></span></a>
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">代表者</th>
                    <td>代表取締役　社長執行役員 兼 CEO　室岡　光浩</td>
                  </tr>

                  <tr>
                    <th scope="row">資本金</th>
                    <td>1億円</td>
                  </tr>

                  <tr>
                    <th scope="row">取引銀行</th>
                    <td>三菱ＵＦＪ銀行、みずほ銀行、三井住友銀行、横浜銀行</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <img src="/images/img_fuji.png" alt="ロゴ" className="Proof" />
    </div>
  );
}