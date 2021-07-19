import { inject, InjectionKey, provide, Ref } from 'vue';
import type { NullableDateType, RangeValue } from './interface';

export type RangeContextProps = {
  /**
   * Set displayed range value style.
   * Panel only has one value, this is only style effect.
   */
  rangedValue?: Ref<[NullableDateType<any>, NullableDateType<any>] | null>;
  hoverRangedValue?: Ref<RangeValue<any>>;
  inRange?: Ref<boolean>;
  panelPosition?: Ref<'left' | 'right' | false>;
};

const RangeContextKey: InjectionKey<RangeContextProps> = Symbol('RangeContextProps');

export const useProvideRange = (props: RangeContextProps) => {
  provide(RangeContextKey, props);
};

export const useInjectRange = () => {
  return inject(RangeContextKey);
};

export default RangeContextKey;
