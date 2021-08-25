import type { VNodeProps } from 'vue';
import { reactive } from 'vue';
import type { GetKey } from '../interface';

type CacheMap = Record<string, number>;

export default function useHeights<T>(
  getKey: GetKey<T>,
  onItemAdd?: ((item: T) => void) | null,
  onItemRemove?: ((item: T) => void) | null,
): [(item: T, instance: HTMLElement) => void, () => void, CacheMap] {
  const instance = new Map<VNodeProps['key'], HTMLElement>();
  const heights = reactive({});
  let heightUpdateId = 0;
  function collectHeight() {
    heightUpdateId += 1;
    const currentId = heightUpdateId;
    Promise.resolve().then(() => {
      // Only collect when it's latest call
      if (currentId !== heightUpdateId) return;
      // let changed = false;
      instance.forEach((element, key) => {
        if (element && element.offsetParent) {
          const { offsetHeight } = element;
          if (heights[key!] !== offsetHeight) {
            //changed = true;
            heights[key!] = element.offsetHeight;
          }
        }
      });
    });
  }

  function setInstance(item: T, ins: HTMLElement) {
    const key = getKey(item);
    const origin = instance.get(key);

    if (ins) {
      instance.set(key, (ins as any).$el || ins);
      collectHeight();
    } else {
      instance.delete(key);
    }

    // Instance changed
    if (!origin !== !ins) {
      if (ins) {
        onItemAdd?.(item);
      } else {
        onItemRemove?.(item);
      }
    }
  }

  return [setInstance, collectHeight, heights];
}
