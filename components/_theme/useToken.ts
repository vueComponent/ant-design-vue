import type { Theme } from '../_util/_cssinjs';
import { useCacheToken } from '../_util/_cssinjs';

import version from '../version';
import type { DesignTokenProviderProps } from './context';
import { defaultTheme, useDesignTokenInject } from './context';
import type { AliasToken, GlobalToken, MapToken, SeedToken } from './interface';
import defaultSeedToken from './themes/seed';
import formatToken from './util/alias';
import { computed } from 'vue';
import type { ComputedRef } from 'vue';

export const unitless: {
  [key in keyof AliasToken]?: boolean;
} = {
  lineHeight: true,
  lineHeightSM: true,
  lineHeightLG: true,
  lineHeightHeading1: true,
  lineHeightHeading2: true,
  lineHeightHeading3: true,
  lineHeightHeading4: true,
  lineHeightHeading5: true,
  opacityLoading: true,
  fontWeightStrong: true,
  zIndexPopupBase: true,
  zIndexBase: true,
};

export const ignore: {
  [key in keyof AliasToken]?: boolean;
} = {
  size: true,
  sizeSM: true,
  sizeLG: true,
  sizeMD: true,
  sizeXS: true,
  sizeXXS: true,
  sizeMS: true,
  sizeXL: true,
  sizeXXL: true,
  sizeUnit: true,
  sizeStep: true,
  motionBase: true,
  motionUnit: true,
};

const preserve: {
  [key in keyof AliasToken]?: boolean;
} = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true,
  screenXXLMax: true,
  screenXXXL: true,
  screenXXXLMin: true,
};

export const getComputedToken = (
  originToken: SeedToken,
  overrideToken: DesignTokenProviderProps['components'] & {
    override?: Partial<AliasToken>;
  },
  theme: Theme<any, any>,
) => {
  const derivativeToken = theme.getDerivativeToken(originToken);

  const { override, ...components } = overrideToken;

  // Merge with override
  let mergedDerivativeToken = {
    ...derivativeToken,
    override,
  };

  // Format if needed
  mergedDerivativeToken = formatToken(mergedDerivativeToken);

  if (components) {
    Object.entries(components).forEach(([key, value]) => {
      const { theme: componentTheme, ...componentTokens } = value;
      let mergedComponentToken = componentTokens;
      if (componentTheme) {
        mergedComponentToken = getComputedToken(
          {
            ...mergedDerivativeToken,
            ...componentTokens,
          },
          {
            override: componentTokens,
          },
          componentTheme,
        );
      }
      mergedDerivativeToken[key] = mergedComponentToken;
    });
  }

  return mergedDerivativeToken;
};

// ================================== Hook ==================================
export default function useToken(): [
  ComputedRef<Theme<SeedToken, MapToken>>,
  ComputedRef<GlobalToken>,
  ComputedRef<string>,
  ComputedRef<GlobalToken>,
  ComputedRef<DesignTokenProviderProps['cssVar']>,
] {
  const designToken = useDesignTokenInject();

  const salt = computed(() => `${version}-${designToken.value.hashed || ''}`);

  const mergedTheme = computed(() => designToken.value.theme || defaultTheme);

  const cacheToken = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    computed(() => [defaultSeedToken, designToken.value.token]),
    computed(() => {
      return {
        salt: salt.value,
        override: designToken.value.override,
        getComputedToken,
        // formatToken will not be consumed after 1.15.0 with getComputedToken.
        // But token will break if @ant-design/cssinjs is under 1.15.0 without it
        formatToken,
        cssVar: designToken.value.cssVar && {
          prefix: designToken.value.cssVar.prefix,
          key: designToken.value.cssVar.key,
          unitless,
          ignore,
          preserve,
        },
      };
    }),
  );

  // cacheToken [token, hashId, realToken]
  return [
    mergedTheme,
    computed(() => cacheToken.value[2]),
    computed(() => cacheToken.value[1]),
    computed(() => cacheToken.value[0]),
    computed(() => designToken.value.cssVar),
  ];
}
