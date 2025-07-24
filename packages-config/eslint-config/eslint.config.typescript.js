// @ts-check

import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import checkFile from 'eslint-plugin-check-file'
import tseslint from 'typescript-eslint'
import base from './eslint.config.base.js'
import ignore from './eslint.config.ignore.js'

export default tseslint.config(
  ignore,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/src/**/*.{ts}'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/filename-naming-convention': [
        'warn',
        {
          '**/*.ts': 'KEBAB_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
  base,
  prettier,
)
