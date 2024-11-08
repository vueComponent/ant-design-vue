import type Cache from './Cache';
import { extract as tokenExtractStyle, TOKEN_PREFIX } from './hooks/useCacheToken';
import { CSS_VAR_PREFIX, extract as cssVarExtractStyle } from './hooks/useCSSVarRegister';
import { extract as styleExtractStyle, STYLE_PREFIX } from './hooks/useStyleRegister';
import { toStyleStr } from './util';
import { ATTR_CACHE_MAP, serialize as serializeCacheMap } from './util/cacheMapUtil';

const ExtractStyleFns = {
  [STYLE_PREFIX]: styleExtractStyle,
  [TOKEN_PREFIX]: tokenExtractStyle,
  [CSS_VAR_PREFIX]: cssVarExtractStyle,
};

type ExtractStyleType = keyof typeof ExtractStyleFns;

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export default function extractStyle(
  cache: Cache,
  options?:
    | boolean
    | {
        plain?: boolean;
        types?: ExtractStyleType | ExtractStyleType[];
      },
) {
  const { plain = false, types = ['style', 'token', 'cssVar'] } =
    typeof options === 'boolean' ? { plain: options } : options || {};

  const matchPrefixRegexp = new RegExp(
    `^(${(typeof types === 'string' ? [types] : types).join('|')})%`,
  );

  // prefix with `style` is used for `useStyleRegister` to cache style context
  const styleKeys = Array.from(cache.cache.keys()).filter(key => matchPrefixRegexp.test(key));

  // Common effect styles like animation
  const effectStyles: Record<string, boolean> = {};

  // Mapping of cachePath to style hash
  const cachePathMap: Record<string, string> = {};

  let styleText = '';

  styleKeys
    .map<[number, string] | null>(key => {
      const cachePath = key.replace(matchPrefixRegexp, '').replace(/%/g, '|');
      const [prefix] = key.split('%');
      const extractFn = ExtractStyleFns[prefix as keyof typeof ExtractStyleFns];
      const extractedStyle = extractFn(cache.cache.get(key)![1], effectStyles, {
        plain,
      });
      if (!extractedStyle) {
        return null;
      }
      const [order, styleId, styleStr] = extractedStyle;
      if (key.startsWith('style')) {
        cachePathMap[cachePath] = styleId;
      }
      return [order, styleStr];
    })
    .filter(isNotNull)
    .sort(([o1], [o2]) => o1 - o2)
    .forEach(([, style]) => {
      styleText += style;
    });

  // ==================== Fill Cache Path ====================
  styleText += toStyleStr(
    `.${ATTR_CACHE_MAP}{content:"${serializeCacheMap(cachePathMap)}";}`,
    undefined,
    undefined,
    {
      [ATTR_CACHE_MAP]: ATTR_CACHE_MAP,
    },
    plain,
  );

  return styleText;
}
