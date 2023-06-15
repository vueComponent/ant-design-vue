import type { ComputedRef, InjectionKey } from 'vue';
import { computed, inject, provide } from 'vue';
import type { ColumnType } from './interface';

export type ContextSlots = {
  emptyText?: (...args: any[]) => any;
  expandIcon?: (...args: any[]) => any;
  title?: (...args: any[]) => any;
  footer?: (...args: any[]) => any;
  summary?: (...args: any[]) => any;
  bodyCell?: (...args: any[]) => any;
  expandColumnTitle?: (...args: any[]) => any;
  headerCell?: (...args: any[]) => any;
  customFilterIcon?: (...args: any[]) => any;
  customFilterDropdown?: (...args: any[]) => any;
  // 兼容 2.x 的 columns slots 配置
  [key: string]: ((...args: any[]) => any) | undefined;
};

type SlotsContextProps = ComputedRef<ContextSlots>;

const SlotsContextKey: InjectionKey<SlotsContextProps> = Symbol('SlotsContextProps');

export const useProvideSlots = (props: SlotsContextProps) => {
  provide(SlotsContextKey, props);
};

export const useInjectSlots = () => {
  return inject(SlotsContextKey, computed(() => ({})) as SlotsContextProps);
};

type ContextProps = {
  onResizeColumn: (w: number, column: ColumnType<any>) => void;
};

const ContextKey: InjectionKey<ContextProps> = Symbol('ContextProps');

export const useProvideTableContext = (props: ContextProps) => {
  provide(ContextKey, props);
};

export const useInjectTableContext = () => {
  return inject(ContextKey, { onResizeColumn: () => {} } as ContextProps);
};
