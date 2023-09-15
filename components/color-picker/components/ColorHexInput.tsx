import type { Color } from '../color';
import type { ColorPickerBaseProps } from '../interface';

import { computed, defineComponent, ref, watch } from 'vue';

import Input from '../../input';

import { generateColor, toHexFormat } from '../util';

interface ColorHexInputProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  value?: Color;
  onChange?: (value: Color) => void;
}

const hexReg = /(^#[\da-f]{6}$)|(^#[\da-f]{8}$)/i;
const isHexString = (hex?: string) => hexReg.test(`#${hex}`);
const ColorHexInput = defineComponent({
  name: 'ColorHexInput',
  props: ['prefixCls', 'value', 'onChange'],
  setup(props: ColorHexInputProps) {
    const colorHexInputPrefixCls = computed(() => `${props.prefixCls}-hex-input`);
    const hexValue = ref(props.value?.toHex());
    watch(
      () => props.value,
      val => {
        const hex = val?.toHex();
        if (isHexString(hex) && val) {
          hexValue.value = toHexFormat(hex);
        }
      },
      {
        immediate: true,
      },
    );
    const handleHexChange = e => {
      const originValue = e.target.value;
      hexValue.value = toHexFormat(originValue);
      if (isHexString(toHexFormat(originValue, true))) {
        props.onChange?.(generateColor(originValue));
      }
    };
    return () => (
      <Input
        class={colorHexInputPrefixCls.value}
        value={hexValue.value.toUpperCase()}
        prefix="#"
        onChange={handleHexChange}
        size="small"
      />
    );
  },
});

export default ColorHexInput;
