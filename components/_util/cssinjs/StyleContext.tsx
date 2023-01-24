import type { InjectionKey, Ref } from 'vue';
import { unref, computed, inject } from 'vue';
import CacheEntity from './Cache';
import type { Linter } from './linters/interface';
import type { Transformer } from './transformers/interface';

export const ATTR_TOKEN = 'data-token-hash';
export const ATTR_MARK = 'data-css-hash';
export const ATTR_DEV_CACHE_PATH = 'data-dev-cache-path';

// Mark css-in-js instance in style element
export const CSS_IN_JS_INSTANCE = '__cssinjs_instance__';
export const CSS_IN_JS_INSTANCE_ID = Math.random().toString(12).slice(2);

export function createCache() {
  if (typeof document !== 'undefined' && document.head && document.body) {
    const styles = document.body.querySelectorAll(`style[${ATTR_MARK}]`) || [];
    const { firstChild } = document.head;

    Array.from(styles).forEach(style => {
      (style as any)[CSS_IN_JS_INSTANCE] =
        (style as any)[CSS_IN_JS_INSTANCE] || CSS_IN_JS_INSTANCE_ID;

      // Not force move if no head
      document.head.insertBefore(style, firstChild);
    });

    // Deduplicate of moved styles
    const styleHash: Record<string, boolean> = {};
    Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`)).forEach(style => {
      const hash = style.getAttribute(ATTR_MARK)!;
      if (styleHash[hash]) {
        if ((style as any)[CSS_IN_JS_INSTANCE] === CSS_IN_JS_INSTANCE_ID) {
          style.parentNode?.removeChild(style);
        }
      } else {
        styleHash[hash] = true;
      }
    });
  }

  return new CacheEntity();
}

export type HashPriority = 'low' | 'high';

export interface StyleContextProps {
  autoClear?: boolean;
  /** @private Test only. Not work in production. */
  mock?: 'server' | 'client';
  /**
   * Only set when you need ssr to extract style on you own.
   * If not provided, it will auto create <style /> on the end of Provider in server side.
   */
  cache: CacheEntity;
  /** Tell children that this context is default generated context */
  defaultCache: boolean;
  /** Use `:where` selector to reduce hashId css selector priority */
  hashPriority?: HashPriority;
  /** Tell cssinjs where to inject style in */
  container?: Element | ShadowRoot;
  /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
  ssrInline?: boolean;
  /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
  transformers?: Transformer[];
  /**
   * Linters to lint css before inject in document.
   * Styles will be linted after transforming.
   * Please note that `linters` do not support dynamic update.
   */
  linters?: Linter[];
}

const StyleContextKey: InjectionKey<StyleContextProps> = Symbol('StyleContextKey');

export type StyleProviderProps = Partial<StyleContextProps> | Ref<Partial<StyleContextProps>>;
export const useStyleInject = () => {
  return inject(StyleContextKey, {
    hashPriority: 'low',
    cache: createCache(),
    defaultCache: true,
  });
};
export const useStyleProvider = (props: StyleContextProps) => {
  const parentContext = useStyleInject();

  const context = computed<StyleContextProps>(() => {
    const mergedContext: StyleContextProps = {
      ...parentContext,
    };
    const propsValue = unref(props);
    (Object.keys(propsValue) as (keyof StyleContextProps)[]).forEach(key => {
      const value = propsValue[key];
      if (propsValue[key] !== undefined) {
        (mergedContext as any)[key] = value;
      }
    });

    const { cache } = propsValue;
    mergedContext.cache = mergedContext.cache || createCache();
    mergedContext.defaultCache = !cache && parentContext.defaultCache;

    return mergedContext;
  });

  return context;
};

export default {
  useStyleInject,
  useStyleProvider,
};
