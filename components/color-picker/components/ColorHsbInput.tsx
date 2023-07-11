import type { HSB } from '../../vc-color-picker';
import type { Color } from '../color';
import type { ColorPickerBaseProps } from '../interface';

import { computed, defineComponent, ref, watch } from 'vue';

import { getRoundNumber } from '../../vc-color-picker/color';
import { generateColor } from '../util';

import ColorSteppers from './ColorSteppers';

interface ColorHsbInputProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  value?: Color;
  onChange?: (value: Color) => void;
}
const ColorHsbInput = defineComponent({
  name: 'ColorHsbInput',
  props: ['prefixCls', 'value', 'onChange'],
  setup(props: ColorHsbInputProps) {
    const colorHsbInputPrefixCls = computed(() => `${props.prefixCls}-hsb-input`);
    const hsbValue = ref<Color>(generateColor(props.value || '#000'));
    watch(
      () => props.value,
      val => {
        if (val) {
          hsbValue.value = generateColor(val || '#000');
        }
      },
      {
        immediate: true,
      },
    );
    const handleHsbChange = (step: number, type: keyof HSB) => {
      const hsb = hsbValue.value.toHsb();
      hsb[type] = type === 'h' ? step : (step || 0) / 100;
      const genColor = generateColor(hsb);
      if (!props.value) {
        hsbValue.value = genColor;
      }
      props.onChange?.(genColor);
    };
    return () => (
      <div class={colorHsbInputPrefixCls.value}>
        <ColorSteppers
          max={360}
          min={0}
          value={Number(hsbValue.value.toHsb().h)}
          prefixCls={props.prefixCls}
          class={colorHsbInputPrefixCls.value}
          formatter={step => getRoundNumber(step || 0).toString()}
          onChange={step => handleHsbChange(Number(step), 'h')}
        />
        <ColorSteppers
          max={100}
          min={0}
          value={Number(hsbValue.value.toHsb().s) * 100}
          prefixCls={props.prefixCls}
          class={colorHsbInputPrefixCls.value}
          formatter={step => `${getRoundNumber(step || 0)}%`}
          onChange={step => handleHsbChange(Number(step), 's')}
        />
        <ColorSteppers
          max={100}
          min={0}
          value={Number(hsbValue.value.toHsb().b) * 100}
          prefixCls={props.prefixCls}
          class={colorHsbInputPrefixCls.value}
          formatter={step => `${getRoundNumber(step || 0)}%`}
          onChange={step => handleHsbChange(Number(step), 'b')}
        />
      </div>
    );
  },
});

export default ColorHsbInput;
