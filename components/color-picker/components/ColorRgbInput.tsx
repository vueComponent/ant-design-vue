import type { RGB } from '../../vc-color-picker';
import type { Color } from '../color';
import type { ColorPickerBaseProps } from '../interface';

import { computed, defineComponent, ref, watch } from 'vue';
import { generateColor } from '../util';

import ColorSteppers from './ColorSteppers';

interface ColorRgbInputProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  value?: Color;
  onChange?: (value: Color) => void;
}

const ColorRgbInput = defineComponent({
  name: 'ColorRgbInput',
  props: ['prefixCls', 'value', 'onChange'],
  setup(props: ColorRgbInputProps) {
    const colorRgbInputPrefixCls = computed(() => `${props.prefixCls}-rgb-input`);
    const rgbValue = ref<Color>(generateColor(props.value || '#000'));
    watch(
      () => props.value,
      val => {
        if (val) {
          rgbValue.value = generateColor(val || '#000');
        }
      },
      {
        immediate: true,
      },
    );
    const handleRgbChange = (step: number | null, type: keyof RGB) => {
      const rgb = rgbValue.value.toRgb();
      rgb[type] = step || 0;
      const genColor = generateColor(rgb);
      if (!props.value) {
        rgbValue.value = genColor;
      }
      props.onChange?.(genColor);
    };

    return () => (
      <div class={colorRgbInputPrefixCls.value}>
        <ColorSteppers
          max={255}
          min={0}
          value={Number(rgbValue.value.toRgb().r)}
          prefixCls={props.prefixCls}
          class={colorRgbInputPrefixCls.value}
          onChange={step => handleRgbChange(Number(step), 'r')}
        />
        <ColorSteppers
          max={255}
          min={0}
          value={Number(rgbValue.value.toRgb().g)}
          prefixCls={props.prefixCls}
          class={colorRgbInputPrefixCls.value}
          onChange={step => handleRgbChange(Number(step), 'g')}
        />
        <ColorSteppers
          max={255}
          min={0}
          value={Number(rgbValue.value.toRgb().b)}
          prefixCls={props.prefixCls}
          class={colorRgbInputPrefixCls.value}
          onChange={step => handleRgbChange(Number(step), 'b')}
        />
      </div>
    );
  },
});

export default ColorRgbInput;
