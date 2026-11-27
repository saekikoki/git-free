# 別のパソコンで環境を作る（Windows + WSL）

git から取得したソースを、初めてのパソコンでビルドできるようにするまでの手順です。
`npm run build:lite` などは **WSL（Ubuntu）の中**で実行します。

全体の流れ:

1. WSL（Ubuntu）を入れる
2. Git を設定する
3. Node.js を入れる
4. ソースを取得する
5. ライブラリを入れる（`npm install`）
6. ビルドして確認する
7. （公開する場合）AWS CLI を入れる

> 手順2〜7のコマンドは、すべて **Ubuntu のターミナル**で実行します。
> スタートメニューで「Ubuntu」を検索して開くか、PowerShell で `wsl` と入力すると開けます。

### 各手順の実行場所（早見表）

| 手順 | 使うターミナル | 実行するフォルダ |
|------|------|------|
| 1. WSL を入れる | Windows の PowerShell（管理者） | どこでもよい |
| 2. Git を設定する | Ubuntu | どこでもよい |
| 3. Node.js を入れる | Ubuntu | どこでもよい |
| 4. ソースを取得する | Ubuntu | `~/work`（clone する場所。なければ作る） |
| 5. `npm install` | Ubuntu | **`~/work/git-free/fsi-site`**（`package.json` があるフォルダ） |
| 6. ビルド・確認 | Ubuntu | **`~/work/git-free/fsi-site`** |
| 7. AWS CLI・デプロイ | Ubuntu | AWS CLI の導入はどこでもよい。`deploy` 系は **`~/work/git-free/fsi-site`** |

> 今いるフォルダは `pwd` で確認できます。`package.json` があるか `ls` で見ると、正しい場所か分かります。
> `~` は Ubuntu のホームフォルダ（`/home/<ユーザー名>`）の意味です。

---

## 1. WSL（Ubuntu）を入れる

**実行場所: Windows の PowerShell（管理者として実行）。フォルダはどこでも構いません。**

スタートメニューで「PowerShell」を右クリック →「管理者として実行」で開き、次を実行します。

```powershell
wsl --install -d Ubuntu
```

- 完了したら **パソコンを再起動**します。
- 再起動後に Ubuntu が自動で開くので、ユーザー名とパスワードを決めます（パスワードは入力しても画面に表示されません）。
- 確認: PowerShell で `wsl -l -v` を実行し、`Ubuntu` の VERSION が `2` なら正常です。

`wsl --install` が使えない古い Windows 10 の場合は、Windows Update で更新するか、
Microsoft の公式手順（https://learn.microsoft.com/ja-jp/windows/wsl/install）を参照してください。

会社のパソコンで仮想化が無効のときは、BIOS で「仮想化（Intel VT-x / AMD-V）」を有効にする必要があります。
ポリシーで WSL が禁止されている場合は、情報システム部門に相談してください。

## 2. Git を設定する

**実行場所: Ubuntu のターミナル。フォルダはどこでも構いません**（開いた直後のままで OK）。

Ubuntu には Git が入っていることが多いです。確認と設定をします。

```bash
sudo apt update
sudo apt install -y git curl unzip build-essential
git --version

git config --global user.name  "あなたの名前"
git config --global user.email "あなたのメールアドレス"
```

複数の GitHub アカウントを使っていて push が 403 になるときは [GIT_ACCOUNTS.md](GIT_ACCOUNTS.md) を参照してください。

## 3. Node.js を入れる

**Node.js 22 以上（LTS）** が必要です（Vite 8 は Node 20.19 以上が必須です）。
`nvm`（Node のバージョン管理ツール）で入れます。

**実行場所: Ubuntu のターミナル。フォルダはどこでも構いません**（Node は Ubuntu 全体に入るので、プロジェクトのフォルダにいる必要はありません）。

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

入れ終わったら、**Ubuntu のターミナルを一度閉じて開き直します**（`nvm` を使えるようにするため）。

```bash
nvm install --lts
node -v     # v22.x.x 以上なら OK
npm -v
```

> `apt install nodejs` で入る Node は古いことが多いので使いません。

## 4. ソースを取得する

### 置き場所について

WSL の中のフォルダ（`~/` 以下）に置くのがおすすめです。

| 置き場所 | 速さ | 注意 |
|------|------|------|
| `~/work/` など（WSL の中） | 速い | Windows からは `\\wsl$\Ubuntu\home\<ユーザー名>\work` で見える |
| `/mnt/c/...`（Windows 側） | 遅い（`npm install` が数分かかることも） | OneDrive 配下だと同期のせいでさらに遅くなったり、ファイルが見えるのが遅れたりする |

**実行場所: Ubuntu のターミナル。ホームフォルダ（`~`）から始めます。**

```bash
mkdir -p ~/work                # ① 作業用フォルダを作る（/home/<ユーザー名>/work）
cd ~/work                      # ② その中に移動する
git clone https://github.com/<アカウント名>/git-free.git   # ③ ~/work/git-free ができる
cd git-free/fsi-site           # ④ プロジェクト本体のフォルダに移動する
pwd                            # → /home/<ユーザー名>/work/git-free/fsi-site と表示されれば OK
ls                             # → package.json、src、docs などが見えれば OK
```

できあがるフォルダの構成:

```
~/work/
└── git-free/              ← git のリポジトリ（git clone で作られる。git コマンドはここでも fsi-site でも使える）
    └── fsi-site/          ← ★ プロジェクト本体。以降の npm・bash コマンドはここで実行する
        ├── package.json
        ├── src/
        └── docs/
```

- リポジトリの URL は GitHub のリポジトリ画面の **Code** ボタンで確認できます。
- 初回の `git clone` で認証を求められたら、GitHub のユーザー名と **Personal Access Token**（パスワードの代わり）を入力します。
- このリポジトリは、`fsi-site` フォルダがプロジェクト本体です。以降のコマンドは **`fsi-site` の中**で実行します。

## 5. ライブラリを入れる

**実行場所: Ubuntu のターミナル、`~/work/git-free/fsi-site`**（`package.json` があるフォルダ）。
手順4の続きなら、すでにこのフォルダにいます。ターミナルを開き直した場合は、先に移動します。

```bash
cd ~/work/git-free/fsi-site
```

```bash
npm install
```

`node_modules/` が作られます（git には入っていないので、パソコンごとに必要です）。
Windows 側で `npm install` したものを WSL で使い回すことはできません。**WSL の中でやり直してください**。

## 6. ビルドして確認する

**実行場所: Ubuntu のターミナル、`~/work/git-free/fsi-site`**（手順5と同じフォルダ）。
`npm run ...` は `package.json` のあるフォルダでしか動きません。別のフォルダで実行すると `Missing script` や `ENOENT: package.json` のエラーになります。

```bash
npm run build:lite     # dist-lite/ に出力（廉価版）
npm run check:lite     # 公開前チェック
npm run preview:lite   # http://localhost:4173 で確認（止めるときは Ctrl+C）
```

ビルドが通れば、環境構築は完了です。
`preview:lite` や `dev:lite` で起動したサーバーは、Windows のブラウザから `http://localhost:ポート番号` で開けます。

フル版は `npm run build`（`dist/` に出力）です。

## 7. AWS に公開する場合

**実行場所: Ubuntu のターミナル。**

AWS CLI のインストールと認証情報の設定が必要です。手順は
[CLOUDFORMATION_LITE.md](CLOUDFORMATION_LITE.md) の「手順1」「手順2」にあります
（インストールと `aws configure` は、フォルダはどこでも構いません）。

```bash
aws --version
aws sts get-caller-identity    # アカウント ID が表示されれば認証 OK
```

そのあと、廉価版の公開は次のどれかです（詳細は README の「廉価版」）。
**`deploy` のコマンドは `~/work/git-free/fsi-site` で実行します**（スクリプトの中で `npm run build:lite` を呼ぶため）。

```bash
cd ~/work/git-free/fsi-site
bash infra/cloudformation/deploy.sh     # CloudFormation（おすすめ）
bash infra/scripts/deploy-lite.sh       # S3 のみ
bash infra/scripts/deploy-lite-cdn.sh   # CloudFront（CDK）
```

`deploy-lite-cdn.sh` を使う場合だけ、先に CDK 用のライブラリを入れます。
**実行場所は `~/work/git-free/fsi-site/infra`**（`infra` の中に別の `package.json` があるため）です。

```bash
cd ~/work/git-free/fsi-site/infra
npm install
cd ..                          # fsi-site に戻る（deploy は fsi-site で実行）
```

---

## よくあるつまずき

| 症状 | 原因と対処 |
|---|---|
| `node: command not found` / `nvm: command not found` | ターミナルを開き直す。それでも出る場合は `source ~/.bashrc` |
| `npm install` で `EBADENGINE` や Vite のエラー | Node が古い。`nvm install --lts` のあと `nvm use --lts` |
| `npm install` がとても遅い | `/mnt/c/`（Windows 側）に置いている。`~/work/` に clone し直す |
| `Cannot find module @rollup/rollup-linux-...` などの不一致エラー | Windows 側で入れた `node_modules` が混ざっている。`rm -rf node_modules` のあと `npm install` |
| `bash\r: No such file or directory` などの改行コードのエラー | シェルスクリプトが CRLF になっている。`git config --global core.autocrlf input` を設定し、clone し直す |
| `permission denied`（`npm install -g` 時） | `sudo` を使わず、nvm で入れた Node を使う |
| ビルドで `.ssr-lite` や `dist-lite` が消せない | 前のプレビュー（`preview:lite`）が動いている。`Ctrl+C` で止める |
| `wsl --install` でエラー | PowerShell を管理者として開いているか、仮想化が有効かを確認 |

## 補足

- 初めてのパソコンでも、`npm install` と `npm run build:lite` だけで動きます。`.env.lite` は git に入っているので、再作成は不要です（公開 URL を変えるときだけ編集します）。
- `.env.local` はフル版を手元で動かすときの個人設定で、git に入っていません。必要なら README の「APIの接続先」を見て作ります。
- 自動デプロイ（GitHub Actions）を使う場合は、自分のパソコンに環境がなくても `main` に push するだけで公開されます（[EDITING_LITE.md](EDITING_LITE.md#自動デプロイgithub-actions)）。
