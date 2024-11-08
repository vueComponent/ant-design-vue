import type { ShallowRef, InjectionKey, ExtractPropTypes, ComputedRef } from 'vue';
import {
  defineComponent,
  inject,
  provide,
  shallowRef,
  unref,
  triggerRef,
  watch,
  computed,
} from 'vue';
import type { Theme } from '../_util/_cssinjs';
import { createTheme } from '../_util/_cssinjs';

import { objectType, someType } from '../_util/type';
import type { AliasToken, MapToken, OverrideToken, SeedToken } from './interface';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';

export const defaultTheme = createTheme(defaultDerivative);

// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
const DesignTokenContextKey: InjectionKey<ShallowRef<Partial<DesignTokenProviderProps>>> =
  Symbol('DesignTokenContextKey');

export const globalDesignTokenApi = shallowRef<DesignTokenProviderProps>();

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
  cssVar: someType<{
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
  override?: { override: Partial<AliasToken> } & ComponentsToken;
  hashed?: string | boolean;
  cssVar?: {
    prefix?: string;
    key?: string;
  };
}

export const useDesignTokenProvider = (value: ComputedRef<DesignTokenProviderProps>) => {
  provide(DesignTokenContextKey, value);
  watch(
    value,
    () => {
      globalDesignTokenApi.value = unref(value);
      triggerRef(globalDesignTokenApi);
    },
    { immediate: true, deep: true },
  );
};

export const useDesignTokenInject = () => {
  return inject(
    DesignTokenContextKey,
    computed(() => globalDesignTokenApi.value || defaultConfig),
  );
};
export const DesignTokenProvider = defineComponent({
  props: {
    value: objectType<DesignTokenProviderProps>(),
  },
  setup(props, { slots }) {
    useDesignTokenProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default { useDesignTokenInject, useDesignTokenProvider, DesignTokenProvider };
