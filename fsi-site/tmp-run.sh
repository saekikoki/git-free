#!/bin/bash
{
  node -v
  npm install marked@^16 2>&1 | tail -5
  node -e "console.log('marked', require('marked/package.json').version)"
  node -e "const {StaticRouter}=require('react-router-dom'); console.log('StaticRouter', typeof StaticRouter)"
  node -e "console.log(require('react-router-dom/package.json').version)"
} > tmp-run.log 2>&1
echo done >> tmp-run.log
