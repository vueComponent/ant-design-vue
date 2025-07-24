import { UserConfig, UserConfigFnObject } from 'vite'

export type GetUserConfig = (dirname: string) => UserConfig | UserConfigFnObject

export declare function extendsConfig(
  base: UserConfig | UserConfigFnObject,
  overwrite: UserConfig | UserConfigFnObject,
): UserConfigFnObject
