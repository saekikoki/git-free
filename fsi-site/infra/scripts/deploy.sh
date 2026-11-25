#!/bin/bash
# ============================================================
# gon-hp 一括デプロイスクリプト
# ============================================================
# このスクリプト1つで以下を実行します:
#   1. フロントエンドのビルド (npm run build)
#   2. CDK依存パッケージのインストール
#   3. CDK Bootstrap（初回のみ必要）
#   4. CDKデプロイ（全AWSリソースの構築）
#
# 前提条件:
#   - AWS CLIがインストール済み & aws configure 設定済み
#   - Node.js 20以上がインストール済み
#   - npm がインストール済み
#
# 使い方:
#   chmod +x infra/scripts/deploy.sh
#   ./infra/scripts/deploy.sh
# ============================================================

set -e  # エラーが発生したら即座に停止

# 色付きログ出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ============================================================
# 0. 前提条件チェック
# ============================================================
log "前提条件を確認中..."

command -v node >/dev/null 2>&1 || error "Node.js がインストールされていません"
command -v npm >/dev/null 2>&1 || error "npm がインストールされていません"
command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません"

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  error "Node.js 20以上が必要です（現在: $(node -v)）"
fi

# AWS認証情報の確認
aws sts get-caller-identity >/dev/null 2>&1 || error "AWS認証情報が設定されていません。'aws configure' を実行してください"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=${AWS_DEFAULT_REGION:-ap-northeast-3}

log "AWS Account: ${ACCOUNT_ID}"
log "Region: ${REGION}"

# プロジェクトルートに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "$PROJECT_ROOT"

log "プロジェクトルート: ${PROJECT_ROOT}"

# ============================================================
# 1. フロントエンドビルド
# ============================================================
log "Step 1/4: フロントエンドをビルド中..."

if [ ! -d "node_modules" ]; then
  log "npm install (フロントエンド)..."
  npm install
fi

npm run build

if [ ! -d "dist" ]; then
  error "ビルド結果 (dist/) が見つかりません"
fi

log "フロントエンドビルド完了 ✓"

# ============================================================
# 2. CDK依存パッケージのインストール
# ============================================================
log "Step 2/4: CDK依存パッケージをインストール中..."

cd infra

if [ ! -d "node_modules" ]; then
  npm install
fi

log "CDKパッケージインストール完了 ✓"

# ============================================================
# 3. CDK Bootstrap（初回のみ）
# ============================================================
log "Step 3/4: CDK Bootstrap 確認中..."

# Bootstrapが済んでいるか確認（失敗しても続行）
if ! aws cloudformation describe-stacks --stack-name CDKToolkit --region "$REGION" >/dev/null 2>&1; then
  log "CDK Bootstrap を実行中（初回のみ）..."
  npx cdk bootstrap "aws://${ACCOUNT_ID}/${REGION}"
  log "Bootstrap 完了 ✓"
else
  log "Bootstrap 済み（スキップ）✓"
fi

# ============================================================
# 4. CDKデプロイ
# ============================================================
log "Step 4/4: AWSリソースをデプロイ中..."
log "（初回は5〜10分かかります）"

npx cdk deploy GonHpStack --require-approval never

log ""
log "============================================"
log " デプロイ完了！"
log "============================================"
log ""
log "CloudFormation出力を確認中..."

# デプロイ結果のURLを表示
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name GonHpStack \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontUrl'].OutputValue" \
  --output text 2>/dev/null || echo "取得失敗")

API_URL=$(aws cloudformation describe-stacks \
  --stack-name GonHpStack \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text 2>/dev/null || echo "取得失敗")

log ""
log "Webサイト URL: ${CLOUDFRONT_URL}"
log "API URL:       ${API_URL}"
log ""
log "初期ユーザーを登録するには:"
log "  ./infra/scripts/seed-users.sh"
