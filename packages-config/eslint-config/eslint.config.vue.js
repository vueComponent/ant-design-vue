// @ts-check

import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import base from './eslint.config.base.js';
import ignore from './eslint.config.ignore.js';

export default tseslint.config(
  ignore,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/src/**/*.{ts,vue}'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/filename-naming-convention': [
        'warn',
        {
          '**/*.vue': 'PASCAL_CASE',
          '**/*.ts': 'KEBAB_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'check-file/no-index': 'warn',
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // @ts-ignore
  ...pluginVue.configs['flat/recommended'],
  base,
  {
    rules: {
      'vue/require-default-prop': 'off',
      'vue/no-mutating-props': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      semi: ['error', 'always'],
      quotes: [
        2,
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      'vue/require-prop-types': 0,
      'vue/v-on-event-hyphenation': 0,
      'import/no-unresolved': [2, { ignore: ['^@ant-design-vue/table'] }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  prettier,
);
