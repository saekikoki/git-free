#!/bin/bash
{
  echo "== build:lite =="
  npm run build:lite > /tmp/bl.log 2>&1; echo "exit=$?"
  npm run check:lite > /tmp/cl.log 2>&1; echo "check exit=$?"
  grep -A3 "<category>" dist-lite/en/feed.xml | head -2
  echo "== lint =="
  npx eslint src/i18n src/content src/components src/features/home src/features/news src/features/company src/features/legal src/features/faq src/features/search src/features/errors src/editions src/main.jsx scripts vite.config.js 2>&1 | tail -20
  echo "lint exit=${PIPESTATUS[0]}"
  echo "== cdk synth lite =="
  cd infra
  npx cdk synth GonHpLiteStack -c edition=lite > /tmp/synth.log 2>&1; echo "synth exit=$?"
  tail -5 /tmp/synth.log
  grep -E "gon-hp-lite-rewrite|/404.html|ResponseHeadersPolicyId|max-age" cdk.out/GonHpLiteStack.template.json | head -10
  echo "== cdk synth full (still default) =="
  npx cdk ls 2>&1 | tail -3
  npx cdk ls -c edition=lite 2>&1 | tail -3
} > verify.log 2>&1
echo DONE >> verify.log
