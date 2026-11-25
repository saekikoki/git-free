/**
 * SengokuGame.jsx - 戦国シミュレーションゲーム（城システム統合版）
 *
 * 信長の野望風のターン制戦略シミュレーション。
 * URL: /game
 *
 * ゲームシステム:
 *   - 大名を選択して全国統一を目指す
 *   - 各旧国に実在の城が配置（Wikipedia「日本の城一覧」ベース）
 *   - 城の防御力が戦闘に影響、城の収入力が内政に影響
 *   - ターン制: 内政 → 軍事 → ターン終了
 *   - 戦闘: 兵力 × 武力 × 城防御 × 乱数で勝敗決定
 *   - AI大名が毎ターン自動行動
 */
import { useState, useCallback } from "react";
import PageHead from "../../components/layout/PageHead";
import { CASTLES, getCastlesByProvince } from "./castles";

// ============================================================
// ゲームデータ定義
// ============================================================

const INITIAL_PROVINCES = [
  { id: "owari", name: "尾張", region: "中部", adjacents: ["mino", "mikawa", "ise"] },
  { id: "mino", name: "美濃", region: "中部", adjacents: ["owari", "echizen", "omi", "shinano"] },
  { id: "mikawa", name: "三河", region: "中部", adjacents: ["owari", "totomi", "shinano"] },
  { id: "totomi", name: "遠江", region: "中部", adjacents: ["mikawa", "suruga"] },
  { id: "suruga", name: "駿河", region: "中部", adjacents: ["totomi", "kai", "sagami"] },
  { id: "kai", name: "甲斐", region: "中部", adjacents: ["suruga", "shinano", "sagami"] },
  { id: "shinano", name: "信濃", region: "中部", adjacents: ["kai", "mino", "mikawa", "echigo"] },
  { id: "echigo", name: "越後", region: "北陸", adjacents: ["shinano", "echizen", "dewa"] },
  { id: "echizen", name: "越前", region: "北陸", adjacents: ["mino", "echigo", "omi"] },
  { id: "omi", name: "近江", region: "近畿", adjacents: ["mino", "echizen", "yamashiro", "ise"] },
  { id: "yamashiro", name: "山城", region: "近畿", adjacents: ["omi", "settsu", "ise"] },
  { id: "settsu", name: "摂津", region: "近畿", adjacents: ["yamashiro", "harima"] },
  { id: "ise", name: "伊勢", region: "近畿", adjacents: ["owari", "omi", "yamashiro"] },
  { id: "harima", name: "播磨", region: "中国", adjacents: ["settsu", "bizen", "tajima"] },
  { id: "tajima", name: "但馬", region: "中国", adjacents: ["harima", "izumo"] },
  { id: "bizen", name: "備前", region: "中国", adjacents: ["harima", "aki"] },
  { id: "aki", name: "安芸", region: "中国", adjacents: ["bizen", "izumo", "nagato"] },
  { id: "izumo", name: "出雲", region: "中国", adjacents: ["tajima", "aki"] },
  { id: "nagato", name: "長門", region: "中国", adjacents: ["aki", "buzen"] },
  { id: "buzen", name: "豊前", region: "九州", adjacents: ["nagato", "chikuzen", "bungo"] },
  { id: "chikuzen", name: "筑前", region: "九州", adjacents: ["buzen", "hizen", "bungo"] },
  { id: "bungo", name: "豊後", region: "九州", adjacents: ["buzen", "chikuzen", "hyuga"] },
  { id: "hizen", name: "肥前", region: "九州", adjacents: ["chikuzen", "satsuma"] },
  { id: "hyuga", name: "日向", region: "九州", adjacents: ["bungo", "satsuma"] },
  { id: "satsuma", name: "薩摩", region: "九州", adjacents: ["hizen", "hyuga"] },
  { id: "sagami", name: "相模", region: "関東", adjacents: ["suruga", "kai", "musashi"] },
  { id: "musashi", name: "武蔵", region: "関東", adjacents: ["sagami", "shimotsuke", "kozuke"] },
  { id: "shimotsuke", name: "下野", region: "関東", adjacents: ["musashi", "kozuke", "dewa"] },
  { id: "kozuke", name: "上野", region: "関東", adjacents: ["musashi", "shimotsuke", "echigo"] },
  { id: "dewa", name: "出羽", region: "東北", adjacents: ["echigo", "shimotsuke", "mutsu"] },
  { id: "mutsu", name: "陸奥", region: "東北", adjacents: ["dewa"] },
];

const INITIAL_DAIMYOS = [
  { id: "oda", name: "織田信長", color: "#e74c3c", provinces: ["owari"], gold: 500, soldiers: 8000, attack: 90, defense: 75, politics: 95 },
  { id: "takeda", name: "武田信玄", color: "#8e44ad", provinces: ["kai", "shinano"], gold: 600, soldiers: 12000, attack: 95, defense: 85, politics: 80 },
  { id: "uesugi", name: "上杉謙信", color: "#2980b9", provinces: ["echigo"], gold: 400, soldiers: 10000, attack: 100, defense: 90, politics: 70 },
  { id: "mori", name: "毛利元就", color: "#27ae60", provinces: ["aki", "izumo", "bizen"], gold: 700, soldiers: 9000, attack: 75, defense: 80, politics: 100 },
  { id: "shimazu", name: "島津義久", color: "#f39c12", provinces: ["satsuma", "hyuga"], gold: 500, soldiers: 11000, attack: 88, defense: 82, politics: 78 },
  { id: "hojo", name: "北条氏康", color: "#1abc9c", provinces: ["sagami", "musashi"], gold: 800, soldiers: 9000, attack: 72, defense: 95, politics: 88 },
  { id: "imagawa", name: "今川義元", color: "#e67e22", provinces: ["suruga", "totomi"], gold: 600, soldiers: 7000, attack: 65, defense: 70, politics: 75 },
  { id: "asakura", name: "朝倉義景", color: "#95a5a6", provinces: ["echizen"], gold: 300, soldiers: 5000, attack: 55, defense: 60, politics: 50 },
  { id: "saito", name: "斎藤道三", color: "#d35400", provinces: ["mino"], gold: 400, soldiers: 6000, attack: 78, defense: 72, politics: 85 },
  { id: "date", name: "伊達政宗", color: "#2c3e50", provinces: ["mutsu", "dewa"], gold: 450, soldiers: 8000, attack: 88, defense: 78, politics: 82 },
];

const NEUTRAL_PROVINCES = {
  mikawa: "matsudaira", omi: "rokkaku", yamashiro: "ashikaga",
  settsu: "miyoshi", ise: "kitabatake", harima: "akamatsu", tajima: "yamana",
  nagato: "ouchi", buzen: "otomo", chikuzen: "otomo", bungo: "otomo",
  hizen: "ryuzoji", shimotsuke: "utsunomiya", kozuke: "uesugi_kozuke",
};

// ============================================================
// ゲームロジック
// ============================================================

/**
 * 城の防御力ボーナスを計算
 * 城が多く、防御力が高い国ほど攻めにくい
 */
function getCastleDefenseBonus(provinceId) {
  const castles = getCastlesByProvince(provinceId);
  if (castles.length === 0) return 1.0;
  const avgDef = castles.reduce((sum, c) => sum + c.defense, 0) / castles.length;
  return 1 + (avgDef / 200); // 防御80の城 → 1.4倍のボーナス
}

/**
 * 城の収入合計を計算
 */
function getCastleIncome(provinceId) {
  const castles = getCastlesByProvince(provinceId);
  return castles.reduce((sum, c) => sum + c.income, 0);
}

/**
 * 戦闘計算
 * 攻撃力 = 兵力 × 攻撃武力 × ランダム
 * 防御力 = 兵力 × 防御武力 × 城防御ボーナス × ランダム
 */
function calcBattle(attacker, defender, attackSoldiers, targetProvinceId) {
  const castleBonus = getCastleDefenseBonus(targetProvinceId);
  const atkPower = attackSoldiers * (attacker.attack / 100) * (0.8 + Math.random() * 0.4);
  const defPower = defender.soldiers * (defender.defense / 100) * castleBonus * (0.8 + Math.random() * 0.4);

  const attackerLoss = Math.floor(attackSoldiers * (0.1 + Math.random() * 0.3));
  const defenderLoss = Math.floor(defender.soldiers * (0.15 + Math.random() * 0.25));

  return { attackerWins: atkPower > defPower, attackerLoss, defenderLoss };
}

/** ゲーム初期状態の生成 */
function createInitialState() {
  const provinces = INITIAL_PROVINCES.map((p) => {
    const owner = INITIAL_DAIMYOS.find((d) => d.provinces.includes(p.id));
    if (owner) {
      return { ...p, owner: owner.id, soldiers: Math.floor(owner.soldiers / owner.provinces.length) };
    }
    return { ...p, owner: NEUTRAL_PROVINCES[p.id] || "neutral", soldiers: 2000 + Math.floor(Math.random() * 3000) };
  });

  return {
    turn: 1,
    phase: "select",
    daimyos: INITIAL_DAIMYOS.map((d) => ({ ...d })),
    provinces,
    playerId: null,
    log: ["戦国シミュレーション — 城を攻め落とし天下統一を目指せ！"],
    gameOver: false,
    selectedProvince: null, // 選択中の国（情報表示用）
  };
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function SengokuGame() {
  const [state, setState] = useState(createInitialState);

  // 大名選択
  const selectDaimyo = (daimyoId) => {
    setState((s) => ({
      ...s,
      playerId: daimyoId,
      phase: "command",
      log: [...s.log, `【${s.daimyos.find((d) => d.id === daimyoId).name}】で天下布武を開始！`],
    }));
  };

  // 国をクリックして情報表示
  const selectProvince = (provinceId) => {
    setState((s) => ({ ...s, selectedProvince: provinceId }));
  };

  // 内政: 城の収入 + 兵力増加
  const doNaisei = () => {
    setState((s) => {
      const ownedProvinces = s.provinces.filter((p) => p.owner === s.playerId);
      const baseIncome = ownedProvinces.length * 150;
      const castleIncome = ownedProvinces.reduce((sum, p) => sum + getCastleIncome(p.id), 0);
      const totalIncome = baseIncome + castleIncome;
      const recruit = ownedProvinces.length * 500;

      const newDaimyos = s.daimyos.map((d) =>
        d.id === s.playerId ? { ...d, gold: d.gold + totalIncome, soldiers: d.soldiers + recruit } : d
      );

      return {
        ...s,
        daimyos: newDaimyos,
        log: [...s.log, `【内政】金+${totalIncome}（城収入${castleIncome}）、兵+${recruit}`],
      };
    });
  };

  // 軍事: 攻撃
  const doAttack = (targetProvinceId) => {
    setState((s) => {
      const player = s.daimyos.find((d) => d.id === s.playerId);
      const targetProvince = s.provinces.find((p) => p.id === targetProvinceId);
      if (!targetProvince || targetProvince.owner === s.playerId) return s;

      const attackSoldiers = Math.floor(player.soldiers * 0.6);
      if (attackSoldiers < 1000) {
        return { ...s, log: [...s.log, "兵力不足（最低1000兵必要）"] };
      }

      const defenderDaimyo = s.daimyos.find((d) => d.id === targetProvince.owner);
      const defender = defenderDaimyo || { attack: 50, defense: 60, soldiers: targetProvince.soldiers };
      const castles = getCastlesByProvince(targetProvinceId);
      const mainCastle = castles.length > 0 ? castles[0].name : targetProvince.name;

      const result = calcBattle(player, { ...defender, soldiers: targetProvince.soldiers }, attackSoldiers, targetProvinceId);

      let newDaimyos = [...s.daimyos];
      let newProvinces = [...s.provinces];
      let logMsg;

      if (result.attackerWins) {
        newProvinces = newProvinces.map((p) =>
          p.id === targetProvinceId ? { ...p, owner: s.playerId, soldiers: attackSoldiers - result.attackerLoss } : p
        );
        newDaimyos = newDaimyos.map((d) =>
          d.id === s.playerId ? { ...d, soldiers: d.soldiers - result.attackerLoss } : d
        );
        if (defenderDaimyo) {
          newDaimyos = newDaimyos.map((d) =>
            d.id === defenderDaimyo.id ? { ...d, soldiers: Math.max(0, d.soldiers - result.defenderLoss) } : d
          );
        }
        logMsg = `【落城】${mainCastle}陥落！${targetProvince.name}を制圧（損害${result.attackerLoss}）`;
      } else {
        newDaimyos = newDaimyos.map((d) =>
          d.id === s.playerId ? { ...d, soldiers: d.soldiers - result.attackerLoss } : d
        );
        logMsg = `【撤退】${mainCastle}攻略失敗（損害${result.attackerLoss}）`;
      }

      // 大名滅亡チェック
      newDaimyos = newDaimyos.filter((d) => {
        const hasLand = newProvinces.some((p) => p.owner === d.id);
        if (!hasLand && d.id !== s.playerId) logMsg += ` — ${d.name}滅亡！`;
        return hasLand || d.id === s.playerId;
      });

      const playerCount = newProvinces.filter((p) => p.owner === s.playerId).length;
      const gameOver = playerCount === newProvinces.length;

      return {
        ...s,
        daimyos: newDaimyos,
        provinces: newProvinces,
        log: [...s.log, logMsg, ...(gameOver ? ["天下統一達成！"] : [])],
        gameOver,
      };
    });
  };

  // ターン終了 → AI行動
  const endTurn = () => {
    setState((s) => {
      let ns = { ...s, daimyos: [...s.daimyos], provinces: [...s.provinces], log: [...s.log] };

      ns.daimyos.forEach((ai) => {
        if (ai.id === s.playerId) return;
        const aiProv = ns.provinces.filter((p) => p.owner === ai.id);
        if (aiProv.length === 0) return;

        // AI内政
        const income = aiProv.reduce((sum, p) => sum + getCastleIncome(p.id), 0) + aiProv.length * 100;
        const recruit = aiProv.length * 400;
        ns.daimyos = ns.daimyos.map((d) =>
          d.id === ai.id ? { ...d, gold: d.gold + income, soldiers: d.soldiers + recruit } : d
        );

        // AI攻撃 (50%確率)
        if (Math.random() > 0.5 && ai.soldiers > 3000) {
          const targets = [];
          aiProv.forEach((ap) => {
            ap.adjacents.forEach((adj) => {
              const adjP = ns.provinces.find((p) => p.id === adj);
              if (adjP && adjP.owner !== ai.id) targets.push(adjP);
            });
          });
          if (targets.length > 0) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            const atkSoldiers = Math.floor(ai.soldiers * 0.4);
            const def = { attack: 50, defense: 60, soldiers: target.soldiers };
            const result = calcBattle(ai, def, atkSoldiers, target.id);
            if (result.attackerWins) {
              ns.provinces = ns.provinces.map((p) =>
                p.id === target.id ? { ...p, owner: ai.id, soldiers: atkSoldiers - result.attackerLoss } : p
              );
              ns.daimyos = ns.daimyos.map((d) =>
                d.id === ai.id ? { ...d, soldiers: d.soldiers - result.attackerLoss } : d
              );
              ns.log.push(`${ai.name}が${target.name}を攻略`);
            } else {
              ns.daimyos = ns.daimyos.map((d) =>
                d.id === ai.id ? { ...d, soldiers: d.soldiers - result.attackerLoss } : d
              );
            }
          }
        }
      });

      if (!ns.provinces.some((p) => p.owner === s.playerId)) {
        ns.log.push("全領地を失いました... ゲームオーバー");
        ns.gameOver = true;
      }

      return { ...ns, turn: s.turn + 1 };
    });
  };

  const resetGame = () => setState(createInitialState());

  const player = state.daimyos.find((d) => d.id === state.playerId);
  const playerProvinces = state.provinces.filter((p) => p.owner === state.playerId);

  const getAttackableProvinces = () => {
    const owned = new Set(playerProvinces.map((p) => p.id));
    const targets = new Set();
    playerProvinces.forEach((p) => {
      p.adjacents.forEach((adj) => { if (!owned.has(adj)) targets.add(adj); });
    });
    return [...targets].map((id) => state.provinces.find((p) => p.id === id));
  };

  // 選択中の国の城情報
  const selectedProvinceData = state.selectedProvince
    ? state.provinces.find((p) => p.id === state.selectedProvince)
    : null;
  const selectedCastles = state.selectedProvince ? getCastlesByProvince(state.selectedProvince) : [];

  return (
    <section className="sengoku">
      <PageHead title="戦国シミュレーション" description="城を攻め落とし天下統一を目指すターン制戦略ゲーム" />

      {/* ===== 大名選択画面 ===== */}
      {state.phase === "select" && (
        <div className="sengoku-select">
          <h2 className="sengoku-title">戦国シミュレーション</h2>
          <p className="sengoku-subtitle">大名を選んで天下統一を目指せ — 全{CASTLES.length}城を制覇せよ</p>
          <div className="sengoku-daimyo-grid">
            {state.daimyos.map((d) => {
              const castleCount = d.provinces.reduce((sum, pid) => sum + getCastlesByProvince(pid).length, 0);
              return (
                <button key={d.id} className="sengoku-daimyo-card" style={{ borderColor: d.color }} onClick={() => selectDaimyo(d.id)}>
                  <span className="sengoku-daimyo-name" style={{ color: d.color }}>{d.name}</span>
                  <span className="sengoku-daimyo-stats">
                    {d.provinces.length}国 {castleCount}城 / 兵{d.soldiers.toLocaleString()} / 攻{d.attack} 守{d.defense} 政{d.politics}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== メインゲーム画面 ===== */}
      {state.phase === "command" && player && (
        <div className="sengoku-main">
          {/* ステータスバー */}
          <div className="sengoku-status-bar">
            <span className="sengoku-turn">第{state.turn}ターン</span>
            <span className="sengoku-player-name" style={{ color: player.color }}>{player.name}</span>
            <span>領地: {playerProvinces.length}/{state.provinces.length}国</span>
            <span>兵: {player.soldiers.toLocaleString()}</span>
            <span>金: {player.gold.toLocaleString()}</span>
          </div>

          <div className="sengoku-layout">
            {/* 左: 勢力図 */}
            <div className="sengoku-map">
              <h3>勢力図（クリックで城情報表示）</h3>
              <div className="sengoku-provinces">
                {state.provinces.map((p) => {
                  const ownerDaimyo = state.daimyos.find((d) => d.id === p.owner);
                  const bgColor = ownerDaimyo ? ownerDaimyo.color : "#ddd";
                  const isOwn = p.owner === state.playerId;
                  const isSelected = state.selectedProvince === p.id;
                  const castles = getCastlesByProvince(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`sengoku-province ${isOwn ? "sengoku-province-own" : ""} ${isSelected ? "sengoku-province-selected" : ""}`}
                      style={{ backgroundColor: bgColor }}
                      onClick={() => selectProvince(p.id)}
                      title={`${p.name}（${ownerDaimyo ? ownerDaimyo.name : "中立"}）兵${p.soldiers}`}
                    >
                      <span className="sengoku-province-name">{p.name}</span>
                      {castles.length > 0 && <span className="sengoku-castle-count">{castles.length}城</span>}
                    </div>
                  );
                })}
              </div>

              {/* 凡例 */}
              <div className="sengoku-legend">
                {state.daimyos.map((d) => (
                  <span key={d.id} className="sengoku-legend-item">
                    <span className="sengoku-legend-color" style={{ background: d.color }} />
                    {d.name}({state.provinces.filter((p) => p.owner === d.id).length})
                  </span>
                ))}
              </div>

              {/* 選択中の国の城情報 */}
              {selectedProvinceData && (
                <div className="sengoku-castle-info">
                  <h4>{selectedProvinceData.name}の城</h4>
                  {selectedCastles.length === 0 ? (
                    <p className="sengoku-no-castle">城なし</p>
                  ) : (
                    <ul className="sengoku-castle-list">
                      {selectedCastles.map((c) => (
                        <li key={c.id}>
                          <strong>{c.name}</strong> — 防御{c.defense} / 収入{c.income} / 収容{c.capacity.toLocaleString()}兵
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* 右: コマンドパネル */}
            <div className="sengoku-commands">
              <h3>コマンド</h3>
              <button className="sengoku-cmd-btn sengoku-cmd-naisei" onClick={doNaisei} disabled={state.gameOver}>
                内政（城収入 + 徴兵）
              </button>

              <div className="sengoku-attack-section">
                <h4>軍事 — 攻撃先</h4>
                <div className="sengoku-attack-list">
                  {getAttackableProvinces().map((p) => {
                    const defOwner = state.daimyos.find((d) => d.id === p.owner);
                    const castles = getCastlesByProvince(p.id);
                    const defBonus = getCastleDefenseBonus(p.id);
                    return (
                      <button
                        key={p.id}
                        className="sengoku-cmd-btn sengoku-cmd-attack"
                        onClick={() => doAttack(p.id)}
                        disabled={state.gameOver || player.soldiers < 1000}
                      >
                        {p.name}（{defOwner ? defOwner.name : "中立"} / 兵{p.soldiers} / 城防{Math.round(defBonus * 100)}%）
                      </button>
                    );
                  })}
                </div>
              </div>

              <button className="sengoku-cmd-btn sengoku-cmd-end" onClick={endTurn} disabled={state.gameOver}>
                ターン終了
              </button>

              {state.gameOver && (
                <button className="sengoku-cmd-btn sengoku-cmd-reset" onClick={resetGame}>
                  最初からやり直す
                </button>
              )}
            </div>
          </div>

          {/* ログ */}
          <div className="sengoku-log">
            <h4>戦況ログ</h4>
            <div className="sengoku-log-content">
              {state.log.map((msg, i) => <p key={i}>{msg}</p>)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
