import type { Color } from '../color';
import type { ColorPickerBaseProps } from '../interface';

import { computed, defineComponent, ref, watch } from 'vue';

import { generateColor, getAlphaColor } from '../util';
import ColorSteppers from './ColorSteppers';

interface ColorAlphaInputProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  value?: Color;
  onChange?: (value: Color) => void;
}
const ColorAlphaInput = defineComponent({
  name: 'ColorAlphaInput',
  props: ['prefixCls', 'value', 'onChange'],
  setup(props: ColorAlphaInputProps) {
    const colorAlphaInputPrefixCls = computed(() => `${props.prefixCls}-alpha-input`);
    const alphaValue = ref(generateColor(props.value || '#000'));
    watch(
      () => props.value,
      val => {
        if (val) {
          alphaValue.value = generateColor(val);
        }
      },
      {
        immediate: true,
      },
    );
    const handleAlphaChange = (step: number) => {
      const hsba = alphaValue.value.toHsb();
      hsba.a = (step || 0) / 100;
      const genColor = generateColor(hsba);
      if (!props.value) {
        alphaValue.value = genColor;
      }
      props.onChange?.(genColor);
    };

    return () => (
      <ColorSteppers
        value={getAlphaColor(alphaValue.value)}
        prefixCls={props.prefixCls}
        formatter={step => `${step}%`}
        class={colorAlphaInputPrefixCls.value}
        onChange={handleAlphaChange}
        min={0}
        max={100}
      />
    );
  },
});

export default ColorAlphaInput;
