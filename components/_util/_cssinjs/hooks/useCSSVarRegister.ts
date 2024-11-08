import { removeCSS, updateCSS } from '../../../vc-util/Dom/dynamicCSS';
import { ATTR_MARK, ATTR_TOKEN, CSS_IN_JS_INSTANCE, useStyleInject } from '../StyleContext';
import { isClientSide, toStyleStr } from '../util';
import type { TokenWithCSSVar } from '../util/css-variables';
import { transformToken } from '../util/css-variables';
import type { ExtractStyle } from './useGlobalCache';
import useGlobalCache from './useGlobalCache';
import { uniqueHash } from './useStyleRegister';
import type { ComputedRef } from 'vue';
import { computed } from 'vue';

export const CSS_VAR_PREFIX = 'cssVar';

type CSSVarCacheValue<V, T extends Record<string, V> = Record<string, V>> = [
  cssVarToken: TokenWithCSSVar<V, T>,
  cssVarStr: string,
  styleId: string,
  cssVarKey: string,
];

const useCSSVarRegister = <V, T extends Record<string, V>>(
  config: ComputedRef<{
    path: string[];
    key: string;
    prefix?: string;
    unitless?: Record<string, boolean>;
    ignore?: Record<string, boolean>;
    scope?: string;
    token: any;
  }>,
  fn: () => T,
) => {
  const styleContext = useStyleInject();

  const stylePath = computed(() => {
    return [
      ...config.value.path,
      config.value.key,
      config.value.scope || '',
      config.value.token?._tokenKey,
    ];
  });

  const cache = useGlobalCache<CSSVarCacheValue<V, T>>(
    CSS_VAR_PREFIX,
    stylePath,
    () => {
      const originToken = fn();
      const [mergedToken, cssVarsStr] = transformToken<V, T>(originToken, config.value.key, {
        prefix: config.value.prefix,
        unitless: config.value.unitless,
        ignore: config.value.ignore,
        scope: config.value.scope || '',
      });

      const styleId = uniqueHash(stylePath.value, cssVarsStr);
      return [mergedToken, cssVarsStr, styleId, config.value.key];
    },
    ([, , styleId]) => {
      if (isClientSide) {
        removeCSS(styleId, { mark: ATTR_MARK });
      }
    },
    ([, cssVarsStr, styleId]) => {
      if (!cssVarsStr) {
        return;
      }

      const style = updateCSS(cssVarsStr, styleId, {
        mark: ATTR_MARK,
        prepend: 'queue',
        attachTo: styleContext.value.container,
        priority: -999,
      });

      (style as any)[CSS_IN_JS_INSTANCE] = styleContext.value.cache?.instanceId;

      // Used for `useCacheToken` to remove on batch when token removed
      style.setAttribute(ATTR_TOKEN, config.value.key);
    },
  );

  return cache;
};

export const extract: ExtractStyle<CSSVarCacheValue<any>> = (cache, _effectStyles, options) => {
  const [, styleStr, styleId, cssVarKey] = cache;
  const { plain } = options || {};

  if (!styleStr) {
    return null;
  }

  const order = -999;

  // ====================== Style ======================
  // Used for rc-util
  const sharedAttrs = {
    'data-vc-order': 'prependQueue',
    'data-vc-priority': `${order}`,
  };

  const styleText = toStyleStr(styleStr, cssVarKey, styleId, sharedAttrs, plain);

  return [order, styleId, styleText];
};

export default useCSSVarRegister;
