import { pluginCheckFile } from "../plugins";
import { defineConfig } from 'eslint/config';

export const checkFile = defineConfig([
  {
    name: '@ant-design-vue/check-file',
    files: ['**/src/**/*.{ts,vue}'],
    plugins: {
      'check-file': pluginCheckFile,
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
      'check-file/no-index': 'warn',
    },
  },
])
