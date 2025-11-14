import {
  FlatConfigComposer,
  type Arrayable,
  type Awaitable,
} from 'eslint-flat-config-utils'
import { 
  ignores, 
  javascript, 
  checkFile,
  prettier,
  typescript,
  vue,
} from "./configs"
import type { Config } from './types';
import { isPackageExists } from "local-pkg";
import type { Linter } from 'eslint';
import type { ConfigNames } from './typegen';

interface Options {
  typescript?: boolean,
  vue?: boolean,
  prettier?: boolean,
}

export default (
  options: Options = {},
  ...userConfigs: Awaitable<
    Arrayable<Config> | FlatConfigComposer<any, any> | Linter.Config[]
  >[]
): FlatConfigComposer<Config, ConfigNames> => {
  const {
    typescript: enableTypescript = isPackageExists('typescript'), 
    vue: enableVue = isPackageExists('vue'),
    prettier: enablePrettier = isPackageExists('prettier'),
  } = options

  const configs: Config[][] = [
    ignores,
    checkFile,
    javascript,
  ]

  if (enableTypescript) {
    configs.push(typescript)
  }

  if (enableVue) {
    configs.push(vue)
  }

  if(enablePrettier) {
    configs.push(prettier)
  }

  const composer = new FlatConfigComposer<Config, ConfigNames>(
    ...configs,
    ...(userConfigs as any),
  )

  return composer
}
