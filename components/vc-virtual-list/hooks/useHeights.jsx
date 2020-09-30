import { reactive, ref } from 'vue';
import { findDOMNode } from '../../_util/props-util';

export default function useHeights(getKey, onItemAdd, onItemRemove) {
  const instance = new Map();
  const heights = reactive({});
  let updatedMark = ref(0);
  let heightUpdateId = 0;
  function collectHeight() {
    heightUpdateId += 1;
    const currentId = heightUpdateId;
    Promise.resolve().then(() => {
      // Only collect when it's latest call
      if (currentId !== heightUpdateId) return;
      let changed = false;
      instance.forEach((element, key) => {
        if (element && element.offsetParent) {
          const htmlElement = findDOMNode(element);
          const { offsetHeight } = htmlElement;
          if (heights[key] !== offsetHeight) {
            changed = true;
            heights[key] = htmlElement.offsetHeight;
          }
        }
      });
      if (changed) {
        updatedMark.value++;
      }
    });
  }

  function setInstance(item, ins) {
    const key = getKey(item);
    const origin = instance.get(key);

    if (ins) {
      instance.set(key, ins);
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

  return [setInstance, collectHeight, heights, updatedMark];
}
