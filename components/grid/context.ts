import { Ref, inject, InjectionKey, provide, ComputedRef } from 'vue';

export interface RowContext {
  gutter: ComputedRef<[number, number]>;
  wrap: ComputedRef<boolean>;
  supportFlexGap: Ref<boolean>;
}

export const RowContextKey: InjectionKey<RowContext> = Symbol('rowContextKey');

const useProvideRow = (state: RowContext) => {
  provide(RowContextKey, state);
};

const useInjectRow = () => {
  return inject(RowContextKey);
};

export { useInjectRow, useProvideRow };
export default useProvideRow;
