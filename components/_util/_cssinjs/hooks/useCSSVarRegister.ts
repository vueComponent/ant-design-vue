import { updateCSS } from '../../../vc-util/Dom/dynamicCSS';
import { ATTR_MARK, ATTR_TOKEN, CSS_IN_JS_INSTANCE, useStyleInject } from '../StyleContext';
import { isClientSide, token2key, toStyleStr } from '../util';
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
  tokenKey: string,
  styleId: string,
  cssVarKey: string,
];

const tokenKeys = new Map<string, number>();
function recordCleanToken(tokenKey: string) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
}

function removeStyleTags(key: string, instanceId: string) {
  if (typeof document !== 'undefined') {
    const styles = document.querySelectorAll(`style[${ATTR_MARK}="${key}"]`);

    styles.forEach(style => {
      if ((style as any)[CSS_IN_JS_INSTANCE] === instanceId) {
        style.parentNode?.removeChild(style);
      }
    });
  }
}

const TOKEN_THRESHOLD = 0;

// Remove will check current keys first
function cleanTokenStyle(tokenKey: string, instanceId: string) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);

  const tokenKeyList = Array.from(tokenKeys.keys());
  const cleanableKeyList = tokenKeyList.filter(key => {
    const count = tokenKeys.get(key) || 0;

    return count <= 0;
  });

  // Should keep tokens under threshold for not to insert style too often
  if (tokenKeyList.length - cleanableKeyList.length > TOKEN_THRESHOLD) {
    cleanableKeyList.forEach(key => {
      removeStyleTags(key, instanceId);
      tokenKeys.delete(key);
    });
  }
}

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

      const tokenKey = token2key(mergedToken, '');

      const styleId = uniqueHash(stylePath.value, cssVarsStr);

      recordCleanToken(tokenKey);
      return [mergedToken, cssVarsStr, tokenKey, styleId, config.value.key];
    },
    ([, , tokenKey]) => {
      if (isClientSide) {
        // Remove token will remove all related style
        cleanTokenStyle(tokenKey, styleContext.value?.cache?.instanceId);
      }
    },
    ([, cssVarsStr, tokenKey]) => {
      if (!cssVarsStr) {
        return;
      }

      const style = updateCSS(cssVarsStr, tokenKey, {
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
