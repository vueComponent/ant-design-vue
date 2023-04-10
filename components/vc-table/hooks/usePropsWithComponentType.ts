import type { ComputedRef } from 'vue';
import { computed } from 'vue';
const stringComponents = ['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'] as const;
type ComponentType = (typeof stringComponents)[number] | Function;
export default function usePropsWithComponentType(
  props: Record<string, any>,
  component: ComponentType,
  children: ComputedRef<any>,
) {
  if (typeof component === 'string' && stringComponents.includes(component)) {
    return computed(() => props);
  }
  const key = 'slots';
  const newProps = computed(() => ({
    ...props,
    [key]: { default: () => children.value },
  }));
  return newProps;
}
