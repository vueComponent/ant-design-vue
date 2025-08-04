import { UserConfigFnObject, ViteUserConfig } from 'vitest/config.js'

export type GetUserConfig = (
  dirname: string,
  overwriteLib?: boolean,
) => ViteUserConfig | UserConfigFnObject

export declare function extendsConfig(
  base: ViteUserConfig | UserConfigFnObject,
  overwrite: ViteUserConfig | UserConfigFnObject,
): UserConfigFnObject
