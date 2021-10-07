import type { Ref } from 'vue';
import { ref, watchEffect } from 'vue';
import type { TabSizeMap, TabOffsetMap, Tab, TabOffset } from '../interface';

const DEFAULT_SIZE = { width: 0, height: 0, left: 0, top: 0 };

export default function useOffsets(
  tabs: Ref<Tab[]>,
  tabSizes: Ref<TabSizeMap>,
  // holderScrollWidth: Ref<number>,
): Ref<TabOffsetMap> {
  const offsetMap = ref<TabOffsetMap>(new Map());
  watchEffect(() => {
    const map: TabOffsetMap = new Map();
    const tabsValue = tabs.value;
    const lastOffset = tabSizes.value.get(tabsValue[0]?.key) || DEFAULT_SIZE;
    const rightOffset = lastOffset.left + lastOffset.width;

    for (let i = 0; i < tabsValue.length; i += 1) {
      const { key } = tabsValue[i];
      let data = tabSizes.value.get(key);

      // Reuse last one when not exist yet
      if (!data) {
        data = tabSizes.value.get(tabsValue[i - 1]?.key) || DEFAULT_SIZE;
      }

      const entity = (map.get(key) || { ...data }) as TabOffset;

      // Right
      entity.right = rightOffset - entity.left - entity.width;

      // Update entity
      map.set(key, entity);
    }
    offsetMap.value = new Map(map);
  });

  return offsetMap;
}
