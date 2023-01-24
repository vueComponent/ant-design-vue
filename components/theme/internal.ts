import type { CSSInterpolation, Theme } from '../_util/cssinjs';
import { createTheme, useCacheToken, useStyleRegister } from '../_util/cssinjs';

import version from '../version';
import type {
  AliasToken,
  GlobalToken,
  MapToken,
  OverrideToken,
  PresetColorType,
  PresetColorKey,
  SeedToken,
} from './interface';
import { PresetColors } from './interface';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';
import formatToken from './util/alias';
import type { FullToken } from './util/genComponentStyleHook';
import genComponentStyleHook from './util/genComponentStyleHook';
import statisticToken, { merge as mergeToken, statistic } from './util/statistic';
import type { VueNode } from '../_util/type';
import type { ComputedRef, InjectionKey } from 'vue';
import { computed, inject } from 'vue';

const defaultTheme = createTheme(defaultDerivative);

export {
  // colors
  PresetColors,
  // Statistic
  statistic,
  statisticToken,
  mergeToken,
  // hooks
  useStyleRegister,
  genComponentStyleHook,
};
export type {
  SeedToken,
  AliasToken,
  PresetColorType,
  PresetColorKey,
  // FIXME: Remove this type
  AliasToken as DerivativeToken,
  FullToken,
};

// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
export const defaultConfig = {
  token: defaultSeedToken,
  hashed: true,
};

export interface DesignTokenContext {
  token: Partial<AliasToken>;
  theme?: Theme<SeedToken, MapToken>;
  components?: OverrideToken;
  hashed?: string | boolean;
}
//defaultConfig
const DesignTokenContextKey: InjectionKey<DesignTokenContext> = Symbol('DesignTokenContext');
// ================================== Hook ==================================
export function useToken(): [
  ComputedRef<Theme<SeedToken, MapToken>>,
  ComputedRef<GlobalToken>,
  ComputedRef<string>,
] {
  const designTokenContext = inject(DesignTokenContextKey, defaultConfig);

  const salt = computed(() => `${version}-${designTokenContext.hashed || ''}`);

  const mergedTheme = computed(() => designTokenContext.theme || defaultTheme);

  const cacheToken = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    computed(() => [defaultSeedToken, designTokenContext.token]),
    computed(() => ({
      salt: salt.value,
      override: { override: designTokenContext.token, ...designTokenContext.components },
      formatToken,
    })),
  );

  return [
    mergedTheme,
    computed(() => cacheToken.value[0]),
    computed(() => (designTokenContext.hashed ? cacheToken.value[1] : '')),
  ];
}

export type UseComponentStyleResult = [(node: VueNode) => VueNode, string];

export type GenerateStyle<
  ComponentToken extends object = AliasToken,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken) => ReturnType;
