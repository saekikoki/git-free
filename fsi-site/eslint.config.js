import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // ビルド結果・自動生成物はチェックしない
  globalIgnores(['dist', 'dist-lite', '.ssr-lite', 'infra/cdk.out', 'infra/node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Node.js で動くファイル（ビルド用スクリプト・サーバー）
    files: ['scripts/**/*.{js,mjs}', 'backend/**/*.{js,mjs}', 'vite.config.js'],
    languageOptions: { globals: globals.node },
  },
])
