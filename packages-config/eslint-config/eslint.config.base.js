// @ts-check

/**
 * @type {Pick<import('eslint').Linter.Config, 'rules'>}
 */
export default {
  rules: {
    'no-redeclare': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
  },
}
