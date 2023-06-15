import hash from '@emotion/hash';
import { ATTR_TOKEN, CSS_IN_JS_INSTANCE, CSS_IN_JS_INSTANCE_ID } from '../StyleContext';
import type Theme from '../theme/Theme';
import useGlobalCache from './useGlobalCache';
import { flattenToken, token2key } from '../util';
import type { Ref } from 'vue';
import { ref, computed } from 'vue';

const EMPTY_OVERRIDE = {};

// Generate different prefix to make user selector break in production env.
// This helps developer not to do style override directly on the hash id.
const hashPrefix = process.env.NODE_ENV !== 'production' ? 'css-dev-only-do-not-override' : 'css';

export interface Option<DerivativeToken> {
  /**
   * Generate token with salt.
   * This is used to generate different hashId even same derivative token for different version.
   */
  salt?: string;
  override?: object;
  /**
   * Format token as you need. Such as:
   *
   * - rename token
   * - merge token
   * - delete token
   *
   * This should always be the same since it's one time process.
   * It's ok to useMemo outside but this has better cache strategy.
   */
  formatToken?: (mergedToken: any) => DerivativeToken;
}

const tokenKeys = new Map<string, number>();
function recordCleanToken(tokenKey: string) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
}

function removeStyleTags(key: string) {
  if (typeof document !== 'undefined') {
    const styles = document.querySelectorAll(`style[${ATTR_TOKEN}="${key}"]`);

    styles.forEach(style => {
      if ((style as any)[CSS_IN_JS_INSTANCE] === CSS_IN_JS_INSTANCE_ID) {
        style.parentNode?.removeChild(style);
      }
    });
  }
}

// Remove will check current keys first
function cleanTokenStyle(tokenKey: string) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);

  const tokenKeyList = Array.from(tokenKeys.keys());
  const cleanableKeyList = tokenKeyList.filter(key => {
    const count = tokenKeys.get(key) || 0;

    return count <= 0;
  });

  if (cleanableKeyList.length < tokenKeyList.length) {
    cleanableKeyList.forEach(key => {
      removeStyleTags(key);
      tokenKeys.delete(key);
    });
  }
}

/**
 * Cache theme derivative token as global shared one
 * @param theme Theme entity
 * @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
 * @param option Additional config
 * @returns Call Theme.getDerivativeToken(tokenObject) to get token
 */
export default function useCacheToken<DerivativeToken = object, DesignToken = DerivativeToken>(
  theme: Ref<Theme<any, any>>,
  tokens: Ref<Partial<DesignToken>[]>,
  option: Ref<Option<DerivativeToken>> = ref({}),
) {
  // Basic - We do basic cache here
  const mergedToken = computed(() => Object.assign({}, ...tokens.value));
  const tokenStr = computed(() => flattenToken(mergedToken.value));
  const overrideTokenStr = computed(() => flattenToken(option.value.override || EMPTY_OVERRIDE));

  const cachedToken = useGlobalCache<[DerivativeToken & { _tokenKey: string }, string]>(
    'token',
    computed(() => [
      option.value.salt || '',
      theme.value.id,
      tokenStr.value,
      overrideTokenStr.value,
    ]),
    () => {
      const { salt = '', override = EMPTY_OVERRIDE, formatToken } = option.value;
      const derivativeToken = theme.value.getDerivativeToken(mergedToken.value);

      // Merge with override
      let mergedDerivativeToken = {
        ...derivativeToken,
        ...override,
      };

      // Format if needed
      if (formatToken) {
        mergedDerivativeToken = formatToken(mergedDerivativeToken);
      }

      // Optimize for `useStyleRegister` performance
      const tokenKey = token2key(mergedDerivativeToken, salt);
      mergedDerivativeToken._tokenKey = tokenKey;
      recordCleanToken(tokenKey);

      const hashId = `${hashPrefix}-${hash(tokenKey)}`;
      mergedDerivativeToken._hashId = hashId; // Not used

      return [mergedDerivativeToken, hashId];
    },
    cache => {
      // Remove token will remove all related style
      cleanTokenStyle(cache[0]._tokenKey);
    },
  );

  return cachedToken;
}
