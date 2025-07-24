// @ts-check

import base from './prettier.config.base.js'

/**
 * @type {import('prettier').Config}
 */
export default {
  ...base,
  plugins: ['prettier-plugin-tailwindcss'],
}
