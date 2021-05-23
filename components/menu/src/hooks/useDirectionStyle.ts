import { computed, ComputedRef, CSSProperties } from 'vue';
import { useInjectMenu } from './useMenuContext';

export default function useDirectionStyle(level: ComputedRef<number>): ComputedRef<CSSProperties> {
  const { mode, rtl, inlineIndent } = useInjectMenu();

  return computed(() =>
    mode.value !== 'inline'
      ? null
      : rtl.value
      ? { paddingRight: level.value * inlineIndent.value }
      : { paddingLeft: level.value * inlineIndent.value },
  );
}
