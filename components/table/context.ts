import type { ComputedRef, InjectionKey } from 'vue';
import { computed } from 'vue';
import { inject, provide } from 'vue';

export type ContextSlots = {
  emptyText?: (...args: any[]) => void;
  expandIcon?: (...args: any[]) => void;
  title?: (...args: any[]) => void;
  footer?: (...args: any[]) => void;
  summary?: (...args: any[]) => void;
  bodyCell?: (...args: any[]) => void;
  headerCell?: (...args: any[]) => void;
  customFilterIcon?: (...args: any[]) => void;
  customFilterDropdown?: (...args: any[]) => void;
  // 兼容 2.x 的 columns slots 配置
  [key: string]: (...args: any[]) => void;
};

export type ContextProps = ComputedRef<ContextSlots>;

export const ContextKey: InjectionKey<ContextProps> = Symbol('ContextProps');

export const useProvideSlots = (props: ContextProps) => {
  provide(ContextKey, props);
};

export const useInjectSlots = () => {
  return inject(ContextKey, computed(() => ({})) as ContextProps);
};
