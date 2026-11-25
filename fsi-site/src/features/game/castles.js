/**
 * castles.js - 戦国シミュレーションゲーム用城データ
 *
 * 日本の城一覧（Wikipedia参照）から戦国時代に重要だった城を選定し、
 * 旧国ごとにデータ化しています。
 *
 * 各城のパラメータ:
 *   - id: 城の一意なID
 *   - name: 城名
 *   - province: 所属する旧国ID
 *   - defense: 防御力（城の堅固さ。高いほど攻めにくい）
 *   - income: 収入力（城下町の経済力）
 *   - capacity: 最大駐留兵力
 */

export const CASTLES = [
  // ============ 東北地方 ============
  // 陸奥
  { id: "sendai", name: "仙台城", province: "mutsu", defense: 80, income: 300, capacity: 8000 },
  { id: "aoba", name: "青葉城", province: "mutsu", defense: 70, income: 200, capacity: 5000 },
  { id: "shiroishi", name: "白石城", province: "mutsu", defense: 60, income: 150, capacity: 4000 },
  { id: "iwadeyama", name: "岩出山城", province: "mutsu", defense: 55, income: 120, capacity: 3500 },
  { id: "nihonmatsu", name: "二本松城", province: "mutsu", defense: 65, income: 180, capacity: 5000 },

  // 出羽
  { id: "yamagata", name: "山形城", province: "dewa", defense: 70, income: 250, capacity: 6000 },
  { id: "yonezawa", name: "米沢城", province: "dewa", defense: 75, income: 280, capacity: 7000 },
  { id: "kubota", name: "久保田城", province: "dewa", defense: 60, income: 200, capacity: 5000 },
  { id: "tsurugaoka", name: "鶴ヶ岡城", province: "dewa", defense: 55, income: 150, capacity: 4000 },

  // ============ 関東地方 ============
  // 相模
  { id: "odawara", name: "小田原城", province: "sagami", defense: 95, income: 400, capacity: 15000 },
  { id: "tamanawa", name: "玉縄城", province: "sagami", defense: 65, income: 150, capacity: 4000 },

  // 武蔵
  { id: "edo", name: "江戸城", province: "musashi", defense: 85, income: 350, capacity: 10000 },
  { id: "kawagoe", name: "川越城", province: "musashi", defense: 70, income: 250, capacity: 6000 },
  { id: "iwatsuki", name: "岩槻城", province: "musashi", defense: 60, income: 180, capacity: 5000 },

  // 下野
  { id: "utsunomiya", name: "宇都宮城", province: "shimotsuke", defense: 65, income: 200, capacity: 5000 },
  { id: "karasawayama", name: "唐沢山城", province: "shimotsuke", defense: 75, income: 150, capacity: 4000 },

  // 上野
  { id: "minowa", name: "箕輪城", province: "kozuke", defense: 80, income: 250, capacity: 7000 },
  { id: "kanayama", name: "金山城", province: "kozuke", defense: 70, income: 180, capacity: 5000 },
  { id: "numata", name: "沼田城", province: "kozuke", defense: 65, income: 150, capacity: 4000 },

  // ============ 中部地方 ============
  // 越後
  { id: "kasugayama", name: "春日山城", province: "echigo", defense: 90, income: 350, capacity: 12000 },
  { id: "shibata", name: "新発田城", province: "echigo", defense: 65, income: 200, capacity: 5000 },
  { id: "takada", name: "高田城", province: "echigo", defense: 60, income: 180, capacity: 5000 },

  // 越前
  { id: "ichijodani", name: "一乗谷城", province: "echizen", defense: 75, income: 300, capacity: 8000 },
  { id: "fukui", name: "福井城", province: "echizen", defense: 65, income: 250, capacity: 6000 },
  { id: "maruoka", name: "丸岡城", province: "echizen", defense: 70, income: 180, capacity: 5000 },

  // 信濃
  { id: "ueda", name: "上田城", province: "shinano", defense: 85, income: 200, capacity: 6000 },
  { id: "matsumoto", name: "松本城", province: "shinano", defense: 80, income: 280, capacity: 8000 },
  { id: "komoro", name: "小諸城", province: "shinano", defense: 65, income: 150, capacity: 4000 },
  { id: "kaizu", name: "海津城", province: "shinano", defense: 75, income: 200, capacity: 6000 },

  // 甲斐
  { id: "tsutsujigasaki", name: "躑躅ヶ崎館", province: "kai", defense: 60, income: 300, capacity: 8000 },
  { id: "kofu", name: "甲府城", province: "kai", defense: 75, income: 250, capacity: 7000 },
  { id: "shinpu", name: "新府城", province: "kai", defense: 70, income: 180, capacity: 5000 },

  // 駿河
  { id: "sunpu", name: "駿府城", province: "suruga", defense: 70, income: 350, capacity: 8000 },
  { id: "kakegawa", name: "掛川城", province: "suruga", defense: 65, income: 200, capacity: 5000 },

  // 遠江
  { id: "hamamatsu", name: "浜松城", province: "totomi", defense: 70, income: 280, capacity: 7000 },
  { id: "takatenjin", name: "高天神城", province: "totomi", defense: 85, income: 100, capacity: 3000 },
  { id: "futamata", name: "二俣城", province: "totomi", defense: 65, income: 120, capacity: 3500 },

  // 三河
  { id: "okazaki", name: "岡崎城", province: "mikawa", defense: 70, income: 280, capacity: 7000 },
  { id: "yoshida", name: "吉田城", province: "mikawa", defense: 60, income: 200, capacity: 5000 },
  { id: "nagashino", name: "長篠城", province: "mikawa", defense: 55, income: 80, capacity: 2000 },

  // 尾張
  { id: "nagoya", name: "名古屋城", province: "owari", defense: 85, income: 400, capacity: 12000 },
  { id: "kiyosu", name: "清洲城", province: "owari", defense: 70, income: 300, capacity: 8000 },
  { id: "inuyama", name: "犬山城", province: "owari", defense: 75, income: 200, capacity: 5000 },
  { id: "komakiyama", name: "小牧山城", province: "owari", defense: 60, income: 150, capacity: 4000 },

  // 美濃
  { id: "gifu", name: "岐阜城", province: "mino", defense: 80, income: 350, capacity: 10000 },
  { id: "iwamura", name: "岩村城", province: "mino", defense: 85, income: 150, capacity: 4000 },
  { id: "gujo", name: "郡上八幡城", province: "mino", defense: 70, income: 120, capacity: 3000 },

  // 伊勢
  { id: "ise_nagashima", name: "伊勢長島城", province: "ise", defense: 65, income: 200, capacity: 5000 },
  { id: "tsu", name: "津城", province: "ise", defense: 60, income: 250, capacity: 6000 },
  { id: "matsusaka", name: "松坂城", province: "ise", defense: 70, income: 220, capacity: 5000 },

  // ============ 近畿地方 ============
  // 近江
  { id: "azuchi", name: "安土城", province: "omi", defense: 90, income: 400, capacity: 12000 },
  { id: "hikone", name: "彦根城", province: "omi", defense: 85, income: 350, capacity: 10000 },
  { id: "odani", name: "小谷城", province: "omi", defense: 80, income: 250, capacity: 7000 },
  { id: "kannonji", name: "観音寺城", province: "omi", defense: 75, income: 280, capacity: 8000 },

  // 山城
  { id: "nijo", name: "二条城", province: "yamashiro", defense: 70, income: 500, capacity: 8000 },
  { id: "fushimi", name: "伏見城", province: "yamashiro", defense: 75, income: 350, capacity: 9000 },

  // 摂津
  { id: "osaka", name: "大坂城", province: "settsu", defense: 95, income: 500, capacity: 15000 },
  { id: "itami", name: "伊丹城", province: "settsu", defense: 65, income: 200, capacity: 5000 },
  { id: "amagasaki", name: "尼崎城", province: "settsu", defense: 60, income: 250, capacity: 6000 },

  // ============ 中国地方 ============
  // 播磨
  { id: "himeji", name: "姫路城", province: "harima", defense: 95, income: 400, capacity: 12000 },
  { id: "miki", name: "三木城", province: "harima", defense: 70, income: 200, capacity: 5000 },

  // 但馬
  { id: "takeda_tajima", name: "竹田城", province: "tajima", defense: 75, income: 150, capacity: 4000 },
  { id: "izushi", name: "出石城", province: "tajima", defense: 60, income: 120, capacity: 3000 },

  // 備前
  { id: "okayama", name: "岡山城", province: "bizen", defense: 75, income: 350, capacity: 9000 },
  { id: "tenjinyama", name: "天神山城", province: "bizen", defense: 65, income: 150, capacity: 4000 },

  // 安芸
  { id: "hiroshima", name: "広島城", province: "aki", defense: 75, income: 350, capacity: 9000 },
  { id: "yoshida_koriyama", name: "吉田郡山城", province: "aki", defense: 85, income: 250, capacity: 8000 },
  { id: "miyao", name: "宮尾城", province: "aki", defense: 60, income: 100, capacity: 2000 },

  // 出雲
  { id: "gassan_toda", name: "月山富田城", province: "izumo", defense: 90, income: 300, capacity: 10000 },
  { id: "matsue", name: "松江城", province: "izumo", defense: 80, income: 280, capacity: 8000 },

  // 長門
  { id: "hagi", name: "萩城", province: "nagato", defense: 70, income: 250, capacity: 7000 },
  { id: "iwakuni", name: "岩国城", province: "nagato", defense: 65, income: 200, capacity: 5000 },

  // ============ 九州地方 ============
  // 豊前
  { id: "kokura", name: "小倉城", province: "buzen", defense: 70, income: 280, capacity: 7000 },
  { id: "nakatsu", name: "中津城", province: "buzen", defense: 65, income: 200, capacity: 5000 },

  // 筑前
  { id: "fukuoka", name: "福岡城", province: "chikuzen", defense: 75, income: 350, capacity: 9000 },
  { id: "dazaifu", name: "大宰府", province: "chikuzen", defense: 55, income: 200, capacity: 4000 },

  // 豊後
  { id: "funai", name: "府内城", province: "bungo", defense: 65, income: 280, capacity: 7000 },
  { id: "oka", name: "岡城", province: "bungo", defense: 80, income: 200, capacity: 5000 },
  { id: "usuki", name: "臼杵城", province: "bungo", defense: 70, income: 180, capacity: 4000 },

  // 肥前
  { id: "saga", name: "佐賀城", province: "hizen", defense: 65, income: 280, capacity: 7000 },
  { id: "nagoya_hizen", name: "名護屋城", province: "hizen", defense: 80, income: 200, capacity: 10000 },

  // 日向
  { id: "nobeoka", name: "延岡城", province: "hyuga", defense: 60, income: 200, capacity: 5000 },
  { id: "obi", name: "飫肥城", province: "hyuga", defense: 65, income: 180, capacity: 4000 },
  { id: "sadowara", name: "佐土原城", province: "hyuga", defense: 55, income: 150, capacity: 3500 },

  // 薩摩
  { id: "kagoshima", name: "鹿児島城", province: "satsuma", defense: 70, income: 350, capacity: 10000 },
  { id: "izaku", name: "伊作城", province: "satsuma", defense: 60, income: 150, capacity: 4000 },
  { id: "chiran", name: "知覧城", province: "satsuma", defense: 65, income: 120, capacity: 3000 },
];

/**
 * 旧国IDから城一覧を取得するヘルパー
 */
export function getCastlesByProvince(provinceId) {
  return CASTLES.filter((c) => c.province === provinceId);
}

/**
 * 城IDから城データを取得するヘルパー
 */
export function getCastleById(castleId) {
  return CASTLES.find((c) => c.id === castleId);
}
