// @ts-check

/**
 * @type {Pick<import('eslint').Linter.Config, 'ignores'>}
 */
export default {
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
}
