import { inject, InjectionKey, provide } from 'vue';
import type { NullableDateType, RangeValue } from './interface';

export type RangeContextProps = {
  /**
   * Set displayed range value style.
   * Panel only has one value, this is only style effect.
   */
  rangedValue?: [NullableDateType<any>, NullableDateType<any>] | null;
  hoverRangedValue?: RangeValue<any>;
  inRange?: boolean;
  panelPosition?: 'left' | 'right' | false;
};


const RangeContextKey: InjectionKey<RangeContextProps> = Symbol('RangeContextProps');

export const useProvideRange = (props: RangeContextProps) => {
  provide(RangeContextKey, props);
};

export const useInjectRange = () => {
  return inject(RangeContextKey);
};


export default RangeContextKey;
