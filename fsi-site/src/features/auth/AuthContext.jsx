/**
 * AuthContext.jsx - 認証（ログイン）状態を管理するファイル
 *
 * このファイルは「誰がログインしているか」をアプリ全体で共有するための仕組みです。
 * React の Context API を使って、どのコンポーネントからでもログイン情報にアクセスできます。
 */
import { createContext, useContext, useState, useEffect } from "react";

// Context（データ共有の器）を作成
const AuthContext = createContext(null);

/**
 * AuthProvider - ログイン状態を子コンポーネント全体に提供するラッパー
 * main.jsx で <AuthProvider> でアプリを囲むことで、全ページでログイン情報を使えます。
 */
export function AuthProvider({ children }) {
  // user: 現在ログインしているユーザーの情報（未ログインなら null）
  const [user, setUser] = useState(null);

  // ページをリロードしてもログイン状態を維持するため、localStorageから復元する
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored)); // JSON文字列をオブジェクトに変換
      } catch {
        localStorage.removeItem("auth_user"); // 壊れたデータは削除
      }
    }
  }, []); // [] = コンポーネント初回表示時に1回だけ実行

  /**
   * login - ログイン処理
   * サーバーにメール＆パスワードを送信し、認証トークンを受け取る
   */
  const login = async (email, password) => {
    // サーバーの /api/login にPOSTリクエストを送信
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // メールとパスワードをJSON形式で送る
    });

    // レスポンスがエラーの場合
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "ログインに失敗しました");
    }

    // ログイン成功: サーバーから { email, role, token } を受け取る
    const data = await res.json();
    const userData = {
      email: data.email,   // メールアドレス
      role: data.role,     // 権限 ("admin" or "user")
      token: data.token,   // 認証トークン（API呼び出し時に使う）
    };

    // ログイン状態をセット & ブラウザに保存（リロードしても消えない）
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    return userData;
  };

  /**
   * logout - ログアウト処理
   * ユーザー情報をクリアし、localStorageからも削除する
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  // 管理者かどうかを判定するフラグ
  const isAdmin = user?.role === "admin";

  // Context で共有する値: user(ユーザー情報), login, logout, isAdmin
  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - ログイン情報を使うためのカスタムフック
 * 使い方: const { user, login, logout, isAdmin } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
