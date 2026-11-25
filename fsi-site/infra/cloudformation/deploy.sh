#!/bin/bash
# ============================================================
# 廉価版 デプロイスクリプト（CloudFormation 版）
# ============================================================
# 実行内容:
#   1. CloudFormation でスタック gon-hp-lite-cfn を作る / 更新する（lite-site.yaml）
#   2. スタックの出力から公開URL・バケット名を受け取る
#   3. その公開URLで廉価版をビルドし（npm run build:lite）、公開前チェックをする（npm run check:lite）
#   4. dist-lite/ を S3 にアップロードする
#   5. CloudFront 版なら、CloudFront のキャッシュを消して新しい内容をすぐ届ける
#
# 使い方（プロジェクト直下で実行）:
#   bash infra/cloudformation/deploy.sh                    # S3 版（HTTP）
#   USE_CLOUDFRONT=true bash infra/cloudformation/deploy.sh # CloudFront 版（HTTPS）
#   独自ドメイン（証明書は us-east-1 の ACM で作成しておく）:
#     USE_CLOUDFRONT=true LITE_DOMAIN=www.example.co.jp \
#     LITE_CERT_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxx \
#     bash infra/cloudformation/deploy.sh
#
# 一度 CloudFront 版で作ったスタックを S3 版に戻す（またはその逆）こともできるが、
# 切り替え時に公開URLが変わるので注意。
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[CFN-LITE]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

STACK=${LITE_STACK_NAME:-gon-hp-lite-cfn}
REGION=${AWS_DEFAULT_REGION:-ap-northeast-3}
USE_CLOUDFRONT=${USE_CLOUDFRONT:-false}

# ---- 前提チェック ----
command -v node >/dev/null 2>&1 || error "Node.js がインストールされていません"
command -v npm >/dev/null 2>&1 || error "npm がインストールされていません"
command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません（docs/CLOUDFORMATION_LITE.md の手順1）"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) \
  || error "AWS認証情報が設定されていません。'aws configure' を実行してください（docs/CLOUDFORMATION_LITE.md の手順2）"

case "$USE_CLOUDFRONT" in true|false) ;; *) error "USE_CLOUDFRONT は true か false で指定してください" ;; esac
if [ -n "$LITE_DOMAIN" ]; then
  [ "$USE_CLOUDFRONT" = true ] || error "LITE_DOMAIN を使う場合は USE_CLOUDFRONT=true にしてください"
  case "$LITE_CERT_ARN" in
    arn:aws:acm:us-east-1:*) ;;
    *) error "LITE_CERT_ARN に us-east-1 の ACM 証明書の ARN を指定してください" ;;
  esac
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "$PROJECT_ROOT"

log "AWSアカウント: ${ACCOUNT_ID}"
log "リージョン:    ${REGION}"
log "スタック:      ${STACK}"
log "配信方法:      $([ "$USE_CLOUDFRONT" = true ] && echo 'S3 + CloudFront（HTTPS）' || echo 'S3 ウェブサイト（HTTP）')"

# ---- 1. スタックの作成・更新 ----
log "Step 1/5: CloudFormation スタックを作成・更新中（CloudFront 版の初回は 5〜15 分）..."
PARAMS=("UseCloudFront=${USE_CLOUDFRONT}")
[ -n "$LITE_DOMAIN" ] && PARAMS+=("DomainName=${LITE_DOMAIN}" "CertificateArn=${LITE_CERT_ARN}")

if ! aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK" \
  --template-file infra/cloudformation/lite-site.yaml \
  --parameter-overrides "${PARAMS[@]}" \
  --tags Project=gon-hp-lite \
  --no-fail-on-empty-changeset; then
  warn "失敗の理由は次のコマンドで確認できます:"
  warn "  aws cloudformation describe-stack-events --stack-name ${STACK} --region ${REGION} --max-items 15"
  error "スタックの作成・更新に失敗しました"
fi

# ---- 2. 出力の取得 ----
output() {
  aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
BUCKET=$(output BucketName)
SITE_URL=$(output SiteUrl)
DIST_ID=$(output DistributionId)
[ -n "$BUCKET" ] && [ "$BUCKET" != "None" ] || error "スタックの出力 BucketName を取得できませんでした"
log "バケット: ${BUCKET}"
log "公開URL:  ${SITE_URL}"

# ---- 3. ビルドとチェック ----
log "Step 2/5: 廉価版をビルド中..."
[ -d node_modules ] || npm install
# 独自ドメインなどで公開URLを指定したい場合は VITE_SITE_URL を先に設定しておく
export VITE_SITE_URL="${VITE_SITE_URL:-$SITE_URL}"
npm run build:lite

log "Step 3/5: 公開前チェック中..."
npm run check:lite || error "公開前チェックでエラーが見つかりました。上の内容を直してから再実行してください。"

# ---- 4. アップロード ----
log "Step 4/5: ファイルをアップロード中..."
# JS・CSS はファイル名に中身のハッシュが付くので長くキャッシュ。HTML が参照する前に置く
aws s3 sync dist-lite/assets "s3://${BUCKET}/assets" --region "$REGION" \
  --cache-control "public, max-age=31536000, immutable"
# HTML・sitemap.xml・RSS・画像は更新がすぐ届くようキャッシュしない。消したページはバケットからも消す
aws s3 sync dist-lite "s3://${BUCKET}" --region "$REGION" --delete --exclude "assets/*" \
  --cache-control "no-cache"
# 使われなくなった古い JS・CSS を掃除
aws s3 sync dist-lite/assets "s3://${BUCKET}/assets" --region "$REGION" --delete \
  --cache-control "public, max-age=31536000, immutable"

# ---- 5. CloudFront のキャッシュ削除 ----
if [ -n "$DIST_ID" ] && [ "$DIST_ID" != "None" ]; then
  log "Step 5/5: CloudFront のキャッシュを削除中..."
  aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" >/dev/null
else
  log "Step 5/5: S3 版なのでキャッシュ削除は不要（スキップ）"
fi

log ""
log "============================================"
log " 廉価版（CloudFormation 版）のデプロイ完了"
log "============================================"
log "URL: ${SITE_URL}"
if [ -n "$LITE_DOMAIN" ]; then
  log "DNS に次の CNAME を登録してください: ${LITE_DOMAIN} → $(output DistributionDomainName)"
fi
log "削除する場合: bash infra/cloudformation/destroy.sh"
