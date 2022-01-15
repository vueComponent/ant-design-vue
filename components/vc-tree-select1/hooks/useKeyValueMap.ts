import type { ComputedRef, Ref } from 'vue';
import { shallowRef, watchEffect } from 'vue';
import type { FlattenDataNode, Key, RawValueType } from '../interface';

/**
 * Return cached Key Value map with DataNode.
 * Only re-calculate when `flattenOptions` changed.
 */
export default function useKeyValueMap(flattenOptions: ComputedRef<FlattenDataNode[]>) {
  const cacheKeyMap: Ref<Map<Key, FlattenDataNode>> = shallowRef(new Map());
  const cacheValueMap: Ref<Map<RawValueType, FlattenDataNode>> = shallowRef(new Map());

  watchEffect(() => {
    const newCacheKeyMap = new Map();
    const newCacheValueMap = new Map();
    // Cache options by key
    flattenOptions.value.forEach((dataNode: FlattenDataNode) => {
      newCacheKeyMap.set(dataNode.key, dataNode);
      newCacheValueMap.set(dataNode.data.value, dataNode);
    });
    cacheKeyMap.value = newCacheKeyMap;
    cacheValueMap.value = newCacheValueMap;
  });
  return [cacheKeyMap, cacheValueMap];
}
