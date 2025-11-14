import { defineConfig } from "eslint/config";
import globals from 'globals'
import { jseslint, pluginUnusedImports } from '../plugins'

export const javascript = defineConfig([
  {
    name: '@ant-design-vue/js/rules',
    plugins: {
			js: jseslint,
      'unused-imports': pluginUnusedImports,
		},
		extends: ["js/recommended"],
    rules: {
      'no-redeclare': 'off',
      "no-unused-vars": "off",
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'error'
    }
  },
  {
    name: '@ant-design-vue/js/setup',
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    }
  },
])
