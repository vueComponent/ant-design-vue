import type { HTMLAttributes } from 'vue';
import { useAttrs } from 'vue';

// 仅用在函数式组件中，不用考虑响应式问题
export default function useMergeProps<T>(props: T) {
  const attrs: HTMLAttributes = useAttrs();
  return { ...props, ...attrs };
}
