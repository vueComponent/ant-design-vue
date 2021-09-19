import type { ComputedRef, InjectionKey } from 'vue';
import { computed, inject, provide } from 'vue';

export type ContextSlots = {
  emptyText?: (...args: any[]) => any;
  expandIcon?: (...args: any[]) => any;
  title?: (...args: any[]) => any;
  footer?: (...args: any[]) => any;
  summary?: (...args: any[]) => any;
  bodyCell?: (...args: any[]) => any;
  headerCell?: (...args: any[]) => any;
  customFilterIcon?: (...args: any[]) => any;
  customFilterDropdown?: (...args: any[]) => any;
  // 兼容 2.x 的 columns slots 配置
  [key: string]: (...args: any[]) => any;
};

export type ContextProps = ComputedRef<ContextSlots>;

export const ContextKey: InjectionKey<ContextProps> = Symbol('ContextProps');

export const useProvideSlots = (props: ContextProps) => {
  provide(ContextKey, props);
};

export const useInjectSlots = () => {
  return inject(ContextKey, computed(() => ({})) as ContextProps);
};
