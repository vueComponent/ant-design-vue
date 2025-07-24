// @ts-check

import typescript from '@ant-design-vue/eslint-config/typescript'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...typescript,
  {
    ignores: ['apps/**', 'packages/**', 'packages-*/**'],
  },
]
