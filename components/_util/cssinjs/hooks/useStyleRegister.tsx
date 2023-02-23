// import hash from '@emotion/hash';
import type * as CSS from 'csstype';
// @ts-ignore
import unitless from '@emotion/unitless';
import { compile, serialize, stringify } from 'stylis';
import type { Theme, Transformer } from '..';
import type Cache from '../Cache';
import type Keyframes from '../Keyframes';
import type { Linter } from '../linters';
import { contentQuotesLinter, hashedAnimationLinter } from '../linters';
import type { HashPriority } from '../StyleContext';
import {
  // useStyleInject,
  // ATTR_DEV_CACHE_PATH,
  ATTR_MARK,
  ATTR_TOKEN,
  // CSS_IN_JS_INSTANCE,
  // CSS_IN_JS_INSTANCE_ID,
} from '../StyleContext';
import { supportLayer } from '../util';
// import useGlobalCache from './useGlobalCache';
// import canUseDom from '../../canUseDom';
// import { removeCSS, updateCSS } from '../../../vc-util/Dom/dynamicCSS';
import type { Ref } from 'vue';
// import { computed } from 'vue';
import type { VueNode } from '../../type';

// const isClientSide = canUseDom();

const SKIP_CHECK = '_skip_check_';

export type CSSProperties = Omit<CSS.PropertiesFallback<number | string>, 'animationName'> & {
  animationName?: CSS.PropertiesFallback<number | string>['animationName'] | Keyframes;
};

export type CSSPropertiesWithMultiValues = {
  [K in keyof CSSProperties]:
    | CSSProperties[K]
    | Extract<CSSProperties[K], string>[]
    | {
        [SKIP_CHECK]: boolean;
        value: CSSProperties[K] | Extract<CSSProperties[K], string>[];
      };
};

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };

type ArrayCSSInterpolation = CSSInterpolation[];

export type InterpolationPrimitive = null | undefined | boolean | number | string | CSSObject;

export type CSSInterpolation = InterpolationPrimitive | ArrayCSSInterpolation | Keyframes;

export type CSSOthersObject = Record<string, CSSInterpolation>;

export interface CSSObject extends CSSPropertiesWithMultiValues, CSSPseudos, CSSOthersObject {}

// ============================================================================
// ==                                 Parser                                 ==
// ============================================================================
// Preprocessor style content to browser support one
export function normalizeStyle(styleStr: string) {
  const serialized = serialize(compile(styleStr), stringify);
  return serialized.replace(/\{%%%\:[^;];}/g, ';');
}

function isCompoundCSSProperty(value: CSSObject[string]) {
  return typeof value === 'object' && value && SKIP_CHECK in value;
}

// 注入 hash 值
function injectSelectorHash(key: string, hashId: string, hashPriority?: HashPriority) {
  if (!hashId) {
    return key;
  }

  const hashClassName = `.${hashId}`;
  const hashSelector = hashPriority === 'low' ? `:where(${hashClassName})` : hashClassName;

  // 注入 hashId
  const keys = key.split(',').map(k => {
    const fullPath = k.trim().split(/\s+/);

    // 如果 Selector 第一个是 HTML Element，那我们就插到它的后面。反之，就插到最前面。
    let firstPath = fullPath[0] || '';
    const htmlElement = firstPath.match(/^\w+/)?.[0] || '';

    firstPath = `${htmlElement}${hashSelector}${firstPath.slice(htmlElement.length)}`;

    return [firstPath, ...fullPath.slice(1)].join(' ');
  });
  return keys.join(',');
}

export interface ParseConfig {
  hashId?: string;
  hashPriority?: HashPriority;
  layer?: string;
  path?: string;
  transformers?: Transformer[];
  linters?: Linter[];
}

export interface ParseInfo {
  root?: boolean;
  injectHash?: boolean;
  parentSelectors: string[];
}

// Global effect style will mount once and not removed
// The effect will not save in SSR cache (e.g. keyframes)
const globalEffectStyleKeys = new Set();

/**
 * @private Test only. Clear the global effect style keys.
 */
export const _cf =
  process.env.NODE_ENV !== 'production' ? () => globalEffectStyleKeys.clear() : undefined;

// Parse CSSObject to style content
export const parseStyle = (
  interpolation: CSSInterpolation,
  config: ParseConfig = {},
  { root, injectHash, parentSelectors }: ParseInfo = {
    root: true,
    parentSelectors: [],
  },
): [
  parsedStr: string,
  // Style content which should be unique on all of the style (e.g. Keyframes).
  // Firefox will flick with same animation name when exist multiple same keyframes.
  effectStyle: Record<string, string>,
] => {
  const { hashId, layer, path, hashPriority, transformers = [], linters = [] } = config;
  let styleStr = '';
  let effectStyle: Record<string, string> = {};

  function parseKeyframes(keyframes: Keyframes) {
    const animationName = keyframes.getName(hashId);
    if (!effectStyle[animationName]) {
      const [parsedStr] = parseStyle(keyframes.style, config, {
        root: false,
        parentSelectors,
      });

      effectStyle[animationName] = `@keyframes ${keyframes.getName(hashId)}${parsedStr}`;
    }
  }

  function flattenList(list: ArrayCSSInterpolation, fullList: CSSObject[] = []) {
    list.forEach(item => {
      if (Array.isArray(item)) {
        flattenList(item, fullList);
      } else if (item) {
        fullList.push(item as CSSObject);
      }
    });

    return fullList;
  }

  const flattenStyleList = flattenList(
    Array.isArray(interpolation) ? interpolation : [interpolation],
  );

  flattenStyleList.forEach(originStyle => {
    // Only root level can use raw string
    const style: CSSObject = typeof originStyle === 'string' && !root ? {} : originStyle;

    if (typeof style === 'string') {
      styleStr += `${style}\n`;
    } else if ((style as any)._keyframe) {
      // Keyframe
      parseKeyframes(style as unknown as Keyframes);
    } else {
      const mergedStyle = transformers.reduce((prev, trans) => trans?.visit?.(prev) || prev, style);

      // Normal CSSObject
      Object.keys(mergedStyle).forEach(key => {
        const value = mergedStyle[key];

        if (
          typeof value === 'object' &&
          value &&
          (key !== 'animationName' || !(value as Keyframes)._keyframe) &&
          !isCompoundCSSProperty(value)
        ) {
          let subInjectHash = false;

          // 当成嵌套对象来处理
          let mergedKey = key.trim();
          // Whether treat child as root. In most case it is false.
          let nextRoot = false;

          // 拆分多个选择器
          if ((root || injectHash) && hashId) {
            if (mergedKey.startsWith('@')) {
              // 略过媒体查询，交给子节点继续插入 hashId
              subInjectHash = true;
            } else {
              // 注入 hashId
              mergedKey = injectSelectorHash(key, hashId, hashPriority);
            }
          } else if (root && !hashId && (mergedKey === '&' || mergedKey === '')) {
            // In case of `{ '&': { a: { color: 'red' } } }` or `{ '': { a: { color: 'red' } } }` without hashId,
            // we will get `&{a:{color:red;}}` or `{a:{color:red;}}` string for stylis to compile.
            // But it does not conform to stylis syntax,
            // and finally we will get `{color:red;}` as css, which is wrong.
            // So we need to remove key in root, and treat child `{ a: { color: 'red' } }` as root.
            mergedKey = '';
            nextRoot = true;
          }

          const [parsedStr, childEffectStyle] = parseStyle(value as any, config, {
            root: nextRoot,
            injectHash: subInjectHash,
            parentSelectors: [...parentSelectors, mergedKey],
          });

          effectStyle = {
            ...effectStyle,
            ...childEffectStyle,
          };

          styleStr += `${mergedKey}${parsedStr}`;
        } else {
          const actualValue = (value as any)?.value ?? value;
          if (
            process.env.NODE_ENV !== 'production' &&
            (typeof value !== 'object' || !(value as any)?.[SKIP_CHECK])
          ) {
            [contentQuotesLinter, hashedAnimationLinter, ...linters].forEach(linter =>
              linter(key, actualValue, { path, hashId, parentSelectors }),
            );
          }

          // 如果是样式则直接插入
          const styleName = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

          // Auto suffix with px
          let formatValue = actualValue;
          if (!unitless[key] && typeof formatValue === 'number' && formatValue !== 0) {
            formatValue = `${formatValue}px`;
          }

          // handle animationName & Keyframe value
          if (key === 'animationName' && (value as Keyframes)?._keyframe) {
            parseKeyframes(value as Keyframes);
            formatValue = (value as Keyframes).getName(hashId);
          }

          styleStr += `${styleName}:${formatValue};`;
        }
      });
    }
  });

  if (!root) {
    styleStr = `{${styleStr}}`;
  } else if (layer && supportLayer()) {
    const layerCells = layer.split(',');
    const layerName = layerCells[layerCells.length - 1].trim();
    styleStr = `@layer ${layerName} {${styleStr}}`;

    // Order of layer if needed
    if (layerCells.length > 1) {
      // zombieJ: stylis do not support layer order, so we need to handle it manually.
      styleStr = `@layer ${layer}{%%%:%}${styleStr}`;
    }
  }

  return [styleStr, effectStyle];
};

// ============================================================================
// ==                                Register                                ==
// ============================================================================
// function uniqueHash(path: (string | number)[], styleStr: string) {
//   return hash(`${path.join('%')}${styleStr}`);
// }

// function Empty() {
//   return null;
// }

/**
 * Register a style to the global style sheet.
 */
export default function useStyleRegister(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _info: Ref<{
    theme: Theme<any, any>;
    token: any;
    path: string[];
    hashId?: string;
    layer?: string;
  }>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _styleFn: () => CSSInterpolation,
) {
  // const styleContext = useStyleInject();

  // const tokenKey = computed(() => info.value.token._tokenKey as string);

  // const fullPath = computed(() => [tokenKey.value, ...info.value.path]);

  // Check if need insert style
  // let isMergedClientSide = isClientSide;
  // if (process.env.NODE_ENV !== 'production' && styleContext.mock !== undefined) {
  //   isMergedClientSide = styleContext.mock === 'client';
  // }

  // const [cacheStyle[0], cacheStyle[1], cacheStyle[2]]
  // const cacheStyle = useGlobalCache(
  //   'style',
  //   fullPath,
  //   // Create cache if needed
  //   () => {
  //     const styleObj = styleFn();
  //     const { hashPriority, container, transformers, linters } = styleContext;
  //     const { path, hashId, layer } = info.value;
  //     const [parsedStyle, effectStyle] = parseStyle(styleObj, {
  //       hashId,
  //       hashPriority,
  //       layer,
  //       path: path.join('-'),
  //       transformers,
  //       linters,
  //     });
  //     const styleStr = normalizeStyle(parsedStyle);
  //     const styleId = uniqueHash(fullPath.value, styleStr);

  //     if (isMergedClientSide) {
  //       const style = updateCSS(styleStr, styleId, {
  //         mark: ATTR_MARK,
  //         prepend: 'queue',
  //         attachTo: container,
  //       });

  //       (style as any)[CSS_IN_JS_INSTANCE] = CSS_IN_JS_INSTANCE_ID;

  //       // Used for `useCacheToken` to remove on batch when token removed
  //       style.setAttribute(ATTR_TOKEN, tokenKey.value);

  //       // Dev usage to find which cache path made this easily
  //       if (process.env.NODE_ENV !== 'production') {
  //         style.setAttribute(ATTR_DEV_CACHE_PATH, fullPath.value.join('|'));
  //       }

  //       // Inject client side effect style
  //       Object.keys(effectStyle).forEach(effectKey => {
  //         if (!globalEffectStyleKeys.has(effectKey)) {
  //           globalEffectStyleKeys.add(effectKey);

  //           // Inject
  //           updateCSS(normalizeStyle(effectStyle[effectKey]), `_effect-${effectKey}`, {
  //             mark: ATTR_MARK,
  //             prepend: 'queue',
  //             attachTo: container,
  //           });
  //         }
  //       });
  //     }

  //     return [styleStr, tokenKey.value, styleId];
  //   },
  //   // Remove cache if no need
  //   ([, , styleId], fromHMR) => {
  //     if ((fromHMR || styleContext.autoClear) && isClientSide) {
  //       removeCSS(styleId, { mark: ATTR_MARK });
  //     }
  //   },
  // );

  return (node: VueNode) => {
    return node;
    // let styleNode: VueNode;
    // if (!styleContext.ssrInline || isMergedClientSide || !styleContext.defaultCache) {
    //   styleNode = <Empty />;
    // } else {
    //   styleNode = (
    //     <style
    //       {...{
    //         [ATTR_TOKEN]: cacheStyle.value[1],
    //         [ATTR_MARK]: cacheStyle.value[2],
    //       }}
    //       innerHTML={cacheStyle.value[0]}
    //     />
    //   );
    // }

    // return (
    //   <>
    //     {styleNode}
    //     {node}
    //   </>
    // );
  };
}

// ============================================================================
// ==                                  SSR                                   ==
// ============================================================================
export function extractStyle(cache: Cache) {
  // prefix with `style` is used for `useStyleRegister` to cache style context
  const styleKeys = Array.from(cache.cache.keys()).filter(key => key.startsWith('style%'));

  // const tokenStyles: Record<string, string[]> = {};

  let styleText = '';

  styleKeys.forEach(key => {
    const [styleStr, tokenKey, styleId]: [string, string, string] = cache.cache.get(key)![1];

    styleText += `<style ${ATTR_TOKEN}="${tokenKey}" ${ATTR_MARK}="${styleId}">${styleStr}</style>`;
  });

  return styleText;
}
