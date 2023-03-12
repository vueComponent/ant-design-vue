import { useStyleInject } from '../StyleContext';
import type { KeyType } from '../Cache';
import useHMR from './useHMR';
import type { ComputedRef, Ref } from 'vue';
import { onBeforeUnmount, computed, watch, watchEffect, shallowRef } from 'vue';

export default function useClientCache<CacheType>(
  prefix: string,
  keyPath: Ref<KeyType[]>,
  cacheFn: () => CacheType,
  onCacheRemove?: (cache: CacheType, fromHMR: boolean) => void,
): ComputedRef<CacheType> {
  const styleContext = useStyleInject();
  const fullPath = computed(() => [prefix, ...keyPath.value]);
  const fullPathStr = shallowRef('');
  watchEffect(() => {
    fullPathStr.value = fullPath.value.join('_');
  });
  const HMRUpdate = useHMR();
  const clearCache = (paths: typeof fullPath.value) => {
    styleContext.cache.update(paths, prevCache => {
      const [times = 0, cache] = prevCache || [];
      const nextCount = times - 1;

      if (nextCount === 0) {
        onCacheRemove?.(cache, false);
        return null;
      }

      return [times - 1, cache];
    });
  };

  watch(
    [fullPathStr, fullPath],
    ([newStr], [oldStr, oldPath]) => {
      if (newStr !== oldStr) {
        if (oldPath) clearCache(oldPath);
        // Create cache
        styleContext.cache.update(fullPath.value, prevCache => {
          const [times = 0, cache] = prevCache || [];

          // HMR should always ignore cache since developer may change it
          let tmpCache = cache;
          if (process.env.NODE_ENV !== 'production' && cache && HMRUpdate) {
            onCacheRemove?.(tmpCache, HMRUpdate);
            tmpCache = null;
          }
          // console.log('create');
          const mergedCache = tmpCache || cacheFn();

          return [times + 1, mergedCache];
        });
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    clearCache(fullPath.value);
  });
  const val = computed(() => {
    return styleContext.cache.get(fullPath.value)![1];
  });
  return val;
}
