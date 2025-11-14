import { defineConfig } from 'eslint/config';

export const ignores= defineConfig({
  ignores: [
    '**/node_modules/',
    '**/dist/',
    '**/public/',
    '**/assets/',
    '**/*.js',
    '**/.turbo/',
    '**/.next/',
    '**/*.html',
    '.github/',
    '.vscode/',
    '**/.tsup/',
  ],
  name: '@ant-design-vue/ignores'
})

