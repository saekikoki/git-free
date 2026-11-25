#!/bin/bash
# ============================================================
# 廉価版 デプロイスクリプト（S3静的ウェブサイトホスティング）
# ============================================================
# 実行内容:
#   1. 廉価版をビルド（npm run build:lite → dist-lite/）
#      公開URL（VITE_SITE_URL）が未設定なら、S3 の公開URLを自動で設定してビルドする
#   2. 公開前チェック（npm run check:lite）。リンク切れなどがあればここで止まる
#   3. S3バケットを作成（なければ）
#   4. 静的ウェブサイトホスティングを有効化（存在しないURLには 404.html を返す）
#   5. 公開読み取りのバケットポリシーを設定
#   6. dist-lite/ をアップロード
#
# 使うAWSサービスは S3 のみ（DB・Lambda・API Gateway は作らない）。
# HTTPS や独自ドメインが必要な場合は deploy-lite-cdn.sh（CloudFront 版）を使う。
#
# 使い方:
#   bash infra/scripts/deploy-lite.sh
#   バケット名を変える場合: LITE_BUCKET_NAME=my-bucket bash infra/scripts/deploy-lite.sh
#   公開URLを指定する場合:  VITE_SITE_URL=https://www.example.co.jp bash infra/scripts/deploy-lite.sh
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY-LITE]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---- 前提チェック ----
command -v node >/dev/null 2>&1 || error "Node.js がインストールされていません"
command -v npm >/dev/null 2>&1 || error "npm がインストールされていません"
command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) \
  || error "AWS認証情報が設定されていません。'aws configure' を実行してください"
REGION=${AWS_DEFAULT_REGION:-ap-northeast-3}
BUCKET=${LITE_BUCKET_NAME:-gon-hp-lite-${ACCOUNT_ID}}

# ウェブサイトURL（古いリージョンは "s3-website-リージョン"、新しいリージョンは "s3-website.リージョン"）
case "$REGION" in
  us-east-1|us-west-1|us-west-2|ap-southeast-1|ap-southeast-2|ap-northeast-1|eu-west-1|sa-east-1)
    URL="http://${BUCKET}.s3-website-${REGION}.amazonaws.com" ;;
  *)
    URL="http://${BUCKET}.s3-website.${REGION}.amazonaws.com" ;;
esac

# 公開URL（sitemap.xml・canonical・SNSカードに使う）。指定がなければ S3 のURL
export VITE_SITE_URL="${VITE_SITE_URL:-$URL}"

log "AWSアカウント: ${ACCOUNT_ID}"
log "リージョン:    ${REGION}"
log "バケット:      ${BUCKET}"
log "公開URL:       ${VITE_SITE_URL}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/../.."

# ---- 1. ビルド ----
log "Step 1/6: 廉価版をビルド中..."
[ -d node_modules ] || npm install
npm run build:lite
[ -f dist-lite/index.html ] || error "ビルド結果 dist-lite/index.html が見つかりません"

# ---- 2. 公開前チェック ----
log "Step 2/6: 公開前チェック中..."
npm run check:lite || error "公開前チェックでエラーが見つかりました。上の内容を直してから再実行してください。"

# ---- 3. バケット作成 ----
log "Step 3/6: S3バケットを確認中..."
if aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  log "バケットは作成済み（スキップ）"
else
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" >/dev/null
  else
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION" >/dev/null
  fi
  log "バケットを作成しました"
fi

# ---- 4. 静的ウェブサイトホスティング ----
# 全ページを事前にHTML化しているので、存在しないURLには「ページが見つかりません」(404.html) を返す
log "Step 4/6: 静的ウェブサイトホスティングを設定中..."
aws s3 website "s3://${BUCKET}" --index-document index.html --error-document 404.html

# ---- 5. 公開設定 ----
log "Step 5/6: 公開読み取りを設定中..."
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false

POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadForWebsite",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::${BUCKET}/*"
  }]
}
EOF
)
if ! aws s3api put-bucket-policy --bucket "$BUCKET" --policy "$POLICY"; then
  error "公開ポリシーを設定できませんでした。アカウント単位の「ブロックパブリックアクセス」が有効か、権限が不足しています。README の「公開できない場合」を参照してください。"
fi

# ---- 6. アップロード ----
log "Step 6/6: ファイルをアップロード中..."
# assets/ の JS・CSS はファイル名に中身のハッシュが付くので、長くキャッシュさせる。
# 新しい HTML が参照するファイルが先に揃うよう、assets/ から先にアップロードする
aws s3 sync dist-lite/assets "s3://${BUCKET}/assets" \
  --cache-control "public, max-age=31536000, immutable"
# HTML・sitemap.xml・RSS・画像などは、更新がすぐ届くようにキャッシュしない。
# --delete: 消した記事のページなど、dist-lite にないファイルはバケットからも消す
aws s3 sync dist-lite "s3://${BUCKET}" --delete --exclude "assets/*" \
  --cache-control "no-cache"
# 古い JS・CSS を最後に掃除する
aws s3 sync dist-lite/assets "s3://${BUCKET}/assets" --delete \
  --cache-control "public, max-age=31536000, immutable"

log ""
log "============================================"
log " 廉価版のデプロイ完了"
log "============================================"
log "URL: ${URL}"
log "削除する場合: bash infra/scripts/destroy-lite.sh"
