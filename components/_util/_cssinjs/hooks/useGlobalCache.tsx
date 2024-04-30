import { useStyleInject } from '../StyleContext';
import type { KeyType } from '../Cache';
import useCompatibleInsertionEffect from './useCompatibleInsertionEffect';
import useHMR from './useHMR';
import type { ShallowRef, Ref } from 'vue';
import { onBeforeUnmount, watch, computed } from 'vue';

export type ExtractStyle<CacheValue> = (
  cache: CacheValue,
  effectStyles: Record<string, boolean>,
  options?: {
    plain?: boolean;
  },
) => [order: number, styleId: string, style: string] | null;

export default function useGlobalCache<CacheType>(
  prefix: string,
  keyPath: Ref<KeyType[]>,
  cacheFn: () => CacheType,
  onCacheRemove?: (cache: CacheType, fromHMR: boolean) => void,
  // Add additional effect trigger by `useInsertionEffect`
  onCacheEffect?: (cachedValue: CacheType) => void,
): ShallowRef<CacheType> {
  const styleContext = useStyleInject();
  const globalCache = computed(() => styleContext.value?.cache);
  const deps = computed(() => [prefix, ...keyPath.value].join('%'));

  const HMRUpdate = useHMR();

  type UpdaterArgs = [times: number, cache: CacheType];

  const buildCache = (updater?: (data: UpdaterArgs) => UpdaterArgs) => {
    globalCache.value.update(deps.value, prevCache => {
      const [times = 0, cache] = prevCache || [undefined, undefined];

      // HMR should always ignore cache since developer may change it
      let tmpCache = cache;
      if (process.env.NODE_ENV !== 'production' && cache && HMRUpdate) {
        onCacheRemove?.(tmpCache, HMRUpdate);
        tmpCache = null;
      }

      const mergedCache = tmpCache || cacheFn();

      const data: UpdaterArgs = [times, mergedCache];

      // Call updater if need additional logic
      return updater ? updater(data) : data;
    });
  };

  watch(deps, () => {
    buildCache();
  });

  let cacheEntity = globalCache.value.get(deps.value);

  // HMR clean the cache but not trigger `useMemo` again
  // Let's fallback of this
  // ref https://github.com/ant-design/cssinjs/issues/127
  if (process.env.NODE_ENV !== 'production' && !cacheEntity) {
    buildCache();
    cacheEntity = globalCache.value.get(deps.value);
  }

  const cacheContent = computed(
    () =>
      (globalCache.value.get(deps.value) && globalCache.value.get(deps.value)![1]) ||
      cacheEntity![1],
  );

  // Remove if no need anymore
  useCompatibleInsertionEffect(
    () => {
      onCacheEffect?.(cacheContent.value);
    },
    polyfill => {
      // It's bad to call build again in effect.
      // But we have to do this since StrictMode will call effect twice
      // which will clear cache on the first time.
      buildCache(([times, cache]) => {
        if (polyfill && times === 0) {
          onCacheEffect?.(cacheContent.value);
        }
        return [times + 1, cache];
      });

      return () => {
        globalCache.value.update(deps.value, prevCache => {
          const [times = 0, cache] = prevCache || [];
          const nextCount = times - 1;
          if (nextCount <= 0) {
            if (polyfill || !globalCache.value.get(deps.value)) {
              onCacheRemove?.(cache, false);
            }
            return null;
          }

          return [times - 1, cache];
        });
      };
    },
    deps,
  );

  onBeforeUnmount(() => {
    buildCache();
  });

  return cacheContent;
}
