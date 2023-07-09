import { computed, defineComponent, ref, watch } from 'vue';
import type { VueNode } from '../../_util/type';
import type { InputNumberProps } from '../../input-number';
import InputNumber from '../../input-number';
import type { ColorPickerBaseProps } from '../interface';
import classNames from '../../_util/classNames';

interface ColorSteppersProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number | null) => void;
  className?: string;
  prefix?: (prefixCls: string) => VueNode;
  formatter?: InputNumberProps['formatter'];
}
const ColorSteppers = defineComponent({
  name: 'ColorSteppers',
  props: ['prefixCls', 'value', 'min', 'max', 'onChange', 'formatter'],
  setup(props: ColorSteppersProps) {
    const colorSteppersPrefixCls = computed(() => `${props.prefixCls}-steppers`);
    const stepValue = ref(props.value);
    watch(
      () => props.value,
      val => {
        if (!Number.isNaN(val)) {
          stepValue.value = val;
        }
      },
      { immediate: true },
    );
    return () => (
      <InputNumber
        class={classNames(colorSteppersPrefixCls.value)}
        min={props.min}
        max={props.max}
        value={stepValue.value}
        formatter={props.formatter}
        size="small"
        onChange={step => {
          if (!props.value) {
            stepValue.value = (step || 0) as number;
          }
          props.onChange?.(step as number);
        }}
      />
    );
  },
});

export default ColorSteppers;
