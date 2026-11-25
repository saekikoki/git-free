/**
 * AccessMap.jsx - 企業情報ページの「アクセス」（住所・最寄り駅・地図）
 *
 * 地図は Google マップの埋め込みを使う（APIキー不要）。
 * ページを開いただけでは Google に通信しないよう、
 * 「地図を表示する」ボタンを押したときに初めて読み込む。
 */
import { useState } from "react";

export default function AccessMap({ t }) {
  const [showMap, setShowMap] = useState(false);
  const q = encodeURIComponent(t.mapQuery);
  const embedUrl = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;

  return (
    <div className="corp-access">
      <div className="corp-access-info">
        <h3 className="corp-access-office">{t.officeName}</h3>
        <p className="corp-access-address">{t.address}</p>
        <ul className="corp-access-routes">
          {t.routes.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <a className="corp-access-open" href={openUrl} target="_blank" rel="noopener noreferrer">
          {t.openInMaps} ↗
        </a>
      </div>

      <div className="corp-access-map">
        {showMap ? (
          <iframe
            title={t.mapTitle}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="corp-access-placeholder">
            <span className="corp-access-pin" aria-hidden="true">📍</span>
            <button type="button" className="hero-v2-btn hero-v2-btn-primary" onClick={() => setShowMap(true)}>
              {t.mapButton}
            </button>
            <p className="corp-access-notice">{t.mapNotice}</p>
          </div>
        )}
      </div>
    </div>
  );
}
