# 複数の GitHub アカウントを使い分ける

1台の PC で複数の GitHub アカウントを使っていると、`git push` のときに別のアカウントの認証情報が使われ、次のようなエラーになることがあります。

```
remote: Permission to xxx/yyy.git denied to <別のアカウント>.
fatal: unable to access 'https://github.com/...': The requested URL returned error: 403
```

> `remote: Your account is suspended.` と表示される場合は、使われたアカウントが GitHub に停止されています。
> そのアカウントを使うつもりだったなら、切り替えでは直りません。https://support.github.com に問い合わせてください。

## 今どのアカウントの認証情報が保存されているか確認する

```powershell
git credential-manager github list
```

## リポジトリごとにアカウントを固定する（おすすめ）

リモートの URL にユーザー名を入れておくと、そのリポジトリでは常にそのアカウントが使われます。切り替える操作そのものが不要になります。

```powershell
git remote set-url origin https://saekikoki@github.com/saekikoki/git-free.git
git push   # 初回だけブラウザでログイン画面が出る
```

- `https://<ユーザー名>@github.com/<リポジトリの持ち主>/<リポジトリ名>.git` の形で書きます
- 別のアカウントで使うリポジトリでは、そのリポジトリで同じコマンドを、そちらのユーザー名で実行します
- Windows の Git に入っている Git Credential Manager が、ユーザー名ごとに認証情報を分けて保存します
- 設定できたかは `git remote -v` で確認できます

### これから clone するリポジトリの場合

最初からユーザー名入りの URL で clone すれば、後から設定する必要はありません。

```powershell
git clone https://saekikoki@github.com/saekikoki/git-free.git
```

## コミットの名前・メールアドレスもリポジトリごとに設定する

ログインするアカウントとは別に、コミットに記録される名前とメールアドレスがあります。
アカウントごとに変えたい場合は、そのリポジトリの中で次を実行します（`--global` を付けないので、このリポジトリだけに効きます）。

```powershell
git config user.name "saekikoki"
git config user.email "<GitHub に登録したメールアドレス>"
```

## 保存された認証情報を消す

間違ったアカウントの認証情報が残っていて邪魔になる場合は、次で消します。

```powershell
git credential-manager github logout <アカウント名>
```

## （参考）コマンド1つで切り替える方法

URL にユーザー名を入れる代わりに、GitHub CLI でログイン中のアカウントを切り替える方法もあります。

```powershell
winget install GitHub.cli     # 初回のみ
gh auth login                 # アカウントごとに1回ずつ実行して登録
gh auth setup-git             # git push で gh のログイン情報を使う設定
gh auth switch -u saekikoki   # 切り替え
gh auth status                # 今どのアカウントか確認
```

この方法は PC 全体で1つのアカウントに切り替わるので、リポジトリごとに違うアカウントを使うなら、上の「リポジトリごとに固定する」方法のほうが間違いが起きにくいです。
