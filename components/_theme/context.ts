import type { ShallowRef, InjectionKey, ExtractPropTypes } from 'vue';
import { defineComponent, inject, provide, shallowRef, unref, watch } from 'vue';
import type { Theme } from '../_util/_cssinjs';
import { createTheme } from '../_util/_cssinjs';

import { objectType, someType, withInstall } from '../_util/type';
import type { AliasToken, MapToken, OverrideToken, SeedToken } from './interface';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';

export const defaultTheme = createTheme(defaultDerivative);

// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
const DesignTokenContextKey: InjectionKey<ShallowRef<Partial<DesignTokenProviderProps>>> =
  Symbol('DesignTokenContextKey');

export const defaultConfig = {
  token: defaultSeedToken,
  override: { override: defaultSeedToken },
  hashed: true,
};

export type ComponentsToken = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    theme?: Theme<SeedToken, MapToken>;
  };
};
export const styleProviderProps = () => ({
  token: objectType<AliasToken>(),
  theme: objectType<Theme<SeedToken, MapToken>>(),
  components: objectType<ComponentsToken>(),
  /** Just merge `token` & `override` at top to save perf */
  override: objectType<{ override: Partial<AliasToken> } & ComponentsToken>(),
  hashed: someType<string | boolean>(),
  cssVar: objectType<{
    prefix?: string;
    key?: string;
  }>(),
});

export type StyleProviderProps = Partial<ExtractPropTypes<ReturnType<typeof styleProviderProps>>>;
export interface DesignTokenProviderProps {
  token: Partial<AliasToken>;
  theme?: Theme<SeedToken, MapToken>;
  components?: ComponentsToken;
  /** Just merge `token` & `override` at top to save perf */
  override: { override: Partial<AliasToken> } & ComponentsToken;
  hashed?: string | boolean;
  cssVar?: {
    prefix?: string;
    key?: string;
  };
}

export const useDesignTokenInject = () => {
  return inject(DesignTokenContextKey, shallowRef(defaultConfig));
};

export const useDesignTokenProvider = (props: DesignTokenProviderProps) => {
  const parentContext = useDesignTokenInject();
  const context = shallowRef<Partial<DesignTokenProviderProps>>(defaultConfig);
  watch(
    [() => unref(props), parentContext],
    () => {
      const mergedContext: Partial<DesignTokenProviderProps> = {
        ...parentContext.value,
      };
      const propsValue = unref(props);
      Object.keys(propsValue).forEach(key => {
        const value = propsValue[key];
        if (propsValue[key] !== undefined) {
          mergedContext[key] = value;
        }
      });

      context.value = mergedContext;
    },
    { immediate: true },
  );
  provide(DesignTokenContextKey, context);
  return context;
};

export const StyleProvider = withInstall(
  defineComponent({
    name: 'ADesignTokenProvider',
    inheritAttrs: false,
    props: styleProviderProps(),
    setup(props, { slots }) {
      useDesignTokenProvider(props);
      return () => slots.default?.();
    },
  }),
);

export default { useDesignTokenInject, useDesignTokenProvider };
