// @ts-check

import { mergeConfig } from 'vite'

/**
 * @type {typeof import('./index.d.ts').extendsConfig}
 */
export function extendsConfig(base, overwrite) {
  return env =>
    mergeConfig(
      typeof base === 'function' ? base(env) : base,
      typeof overwrite === 'function' ? overwrite(env) : overwrite,
    )
}
