import type { InjectionKey, PropType, Ref } from 'vue';
import { defineComponent, inject, provide, ref, toRef, watch } from 'vue';
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

type RangeContextProviderValue = {
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
  return inject(RangeContextKey, {
    rangedValue: ref(),
    hoverRangedValue: ref(),
    inRange: ref(),
    panelPosition: ref(),
  });
};

export const RangeContextProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'PanelContextProvider',
  inheritAttrs: false,
  props: {
    value: {
      type: Object as PropType<RangeContextProviderValue>,
      default: () => ({} as RangeContextProviderValue),
    },
  },
  setup(props, { slots }) {
    const value: RangeContextProps = {
      rangedValue: ref(props.value.rangedValue),
      hoverRangedValue: ref(props.value.hoverRangedValue),
      inRange: ref(props.value.inRange),
      panelPosition: ref(props.value.panelPosition),
    };
    useProvideRange(value);
    toRef;
    watch(
      () => props.value,
      () => {
        Object.keys(props.value).forEach(key => {
          if (value[key]) {
            value[key].value = props.value[key];
          }
        });
      },
    );
    return () => slots.default?.();
  },
});

export default RangeContextKey;
