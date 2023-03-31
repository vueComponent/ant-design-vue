import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import type { StepProps } from '.';
import { isValidElement } from '../_util/props-util';
import type { VueNode } from '../_util/type';
import devWarning from '../vc-util/devWarning';

function filter<T>(items: (T | null)[]): T[] {
  return items.filter(item => item) as T[];
}

export default function useLegacyItems(items?: ComputedRef<StepProps[]>, children?: VueNode[]) {
  if (items.value) {
    return items;
  }
  devWarning(!children, 'Steps', 'Step is deprecated. Please use `items` directly.');
  const childrenItems = computed(() => {
    const items = children.map((node: any) => {
      if (isValidElement(node)) {
        const { props } = node;
        const item: StepProps = {
          ...props,
        };
        return item;
      }
    });
    return filter(items);
  });

  return childrenItems;
}
