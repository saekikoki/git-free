#!/bin/bash
# ============================================================
# 廉価版 デプロイスクリプト（CloudFront 版: HTTPS・独自ドメイン対応）
# ============================================================
# deploy-lite.sh との違い:
#   - HTTPS で配信する（S3 のウェブサイト機能は HTTP のみ）
#   - 独自ドメインを使える
#   - S3 バケットは非公開のまま。「ブロックパブリックアクセス」が有効なアカウントでも使える
# サーバー・DB は使わない点は同じ。費用は S3 + CloudFront の転送量のみ
# （CloudFront には毎月の無料枠がある）。
#
# 実行内容:
#   1. 公開URLを決める（独自ドメイン / 既存スタックの URL / 初回は仮の URL）
#   2. 廉価版をビルド（npm run build:lite）→ 公開前チェック（npm run check:lite）
#   3. CDK で GonHpLiteStack をデプロイ（S3 + CloudFront + アップロード）
#   4. 初回だけ、決まった CloudFront の URL で作り直してもう一度アップロードする
#
# 使い方:
#   bash infra/scripts/deploy-lite-cdn.sh
#   独自ドメインを使う場合（証明書は us-east-1 の ACM で作成しておく）:
#     LITE_DOMAIN=www.example.co.jp \
#     LITE_CERT_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxx \
#     bash infra/scripts/deploy-lite-cdn.sh
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY-LITE-CDN]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

STACK=GonHpLiteStack

command -v node >/dev/null 2>&1 || error "Node.js がインストールされていません"
command -v npm >/dev/null 2>&1 || error "npm がインストールされていません"
command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) \
  || error "AWS認証情報が設定されていません。'aws configure' を実行してください"
REGION=${AWS_DEFAULT_REGION:-ap-northeast-3}
export CDK_DEFAULT_REGION="$REGION"

if [ -n "$LITE_DOMAIN" ] && [ -z "$LITE_CERT_ARN" ]; then
  error "LITE_DOMAIN を使う場合は LITE_CERT_ARN（us-east-1 の ACM 証明書）も指定してください"
fi
case "$LITE_CERT_ARN" in
  ""|arn:aws:acm:us-east-1:*) ;;
  *) error "CloudFront の証明書は us-east-1 で作成したものが必要です（今: ${LITE_CERT_ARN}）" ;;
esac

CDK_CONTEXT=(-c edition=lite)
[ -n "$LITE_DOMAIN" ] && CDK_CONTEXT+=(-c "domainName=${LITE_DOMAIN}" -c "certificateArn=${LITE_CERT_ARN}")

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "$PROJECT_ROOT"

stack_output() {
  aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text 2>/dev/null || true
}

build() {
  log "廉価版をビルド中（公開URL: ${VITE_SITE_URL}）..."
  [ -d node_modules ] || npm install
  npm run build:lite
  npm run check:lite || error "公開前チェックでエラーが見つかりました。上の内容を直してから再実行してください。"
}

cdk_deploy() {
  log "CloudFront と S3 をデプロイ中（初回は 5〜15 分かかります）..."
  (cd infra && npx cdk deploy "$STACK" "${CDK_CONTEXT[@]}" --require-approval never)
}

# ---- CDK の準備 ----
(cd infra && [ -d node_modules ] || npm install)
if ! aws cloudformation describe-stacks --stack-name CDKToolkit --region "$REGION" >/dev/null 2>&1; then
  log "CDK Bootstrap を実行中（初回のみ）..."
  (cd infra && npx cdk bootstrap "aws://${ACCOUNT_ID}/${REGION}")
fi

# ---- 1. 公開URLを決める ----
FIRST_TIME=false
if [ -n "$VITE_SITE_URL" ]; then
  :
elif [ -n "$LITE_DOMAIN" ]; then
  VITE_SITE_URL="https://${LITE_DOMAIN}"
else
  EXISTING=$(stack_output SiteUrl)
  if [ -n "$EXISTING" ] && [ "$EXISTING" != "None" ]; then
    VITE_SITE_URL="$EXISTING"
  else
    FIRST_TIME=true
    VITE_SITE_URL="https://pending.cloudfront.net"
  fi
fi
export VITE_SITE_URL

# ---- 2〜3. ビルドしてデプロイ ----
build
cdk_deploy

# ---- 4. 初回だけ: 決まった URL で作り直す ----
if [ "$FIRST_TIME" = true ]; then
  VITE_SITE_URL=$(stack_output SiteUrl)
  [ -n "$VITE_SITE_URL" ] || error "スタックの出力 SiteUrl を取得できませんでした"
  export VITE_SITE_URL
  log "公開URLが決まったので、その URL で作り直します: ${VITE_SITE_URL}"
  build
  cdk_deploy
fi

log ""
log "============================================"
log " 廉価版（CloudFront 版）のデプロイ完了"
log "============================================"
log "URL: $(stack_output SiteUrl)"
if [ -n "$LITE_DOMAIN" ]; then
  log "DNS に次の CNAME を登録してください: ${LITE_DOMAIN} → $(stack_output DistributionDomainName)"
fi
log "削除する場合: bash infra/scripts/destroy-lite-cdn.sh"
