import type { InjectionKey, Ref } from 'vue';
import { inject, provide } from 'vue';

export interface ExpandedRowProps {
  componentWidth: Ref<number>;
  fixHeader: Ref<boolean>;
  fixColumn: Ref<boolean>;
  horizonScroll: Ref<boolean>;
}
export const ExpandedRowContextKey: InjectionKey<ExpandedRowProps> = Symbol('ExpandedRowProps');

export const useProvideExpandedRow = (props: ExpandedRowProps) => {
  provide(ExpandedRowContextKey, props);
};

export const useInjectExpandedRow = () => {
  return inject(ExpandedRowContextKey, {} as ExpandedRowProps);
};
