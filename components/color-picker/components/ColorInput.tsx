import type { VNode } from 'vue';
import type { Color } from '../color';
import type { ColorPickerBaseProps } from '../interface';

import { computed, defineComponent } from 'vue';

import useMergedState from '../../_util/hooks/useMergedState';

import Select from '../../select';

import { ColorFormat } from '../interface';
import ColorAlphaInput from './ColorAlphaInput';
import ColorHexInput from './ColorHexInput';
import ColorHsbInput from './ColorHsbInput';
import ColorRgbInput from './ColorRgbInput';

interface ColorInputProps
  extends Pick<ColorPickerBaseProps, 'prefixCls' | 'format' | 'onFormatChange'> {
  value?: Color;
  onChange?: (value: Color) => void;
}

const selectOptions = [ColorFormat.hex, ColorFormat.hsb, ColorFormat.rgb].map(format => ({
  value: format,
  label: format.toLocaleUpperCase(),
}));

const ColorInput = defineComponent({
  name: 'ColorInput',
  props: ['prefixCls', 'format', 'onFormatChange', 'value', 'onChange'],
  setup(props: ColorInputProps) {
    const [colorFormat, setColorFormat] = useMergedState(props.format, {
      onChange: props.onFormatChange,
    });

    const colorInputPrefixCls = computed(() => `${props.prefixCls}-input`);
    const handleFormatChange = (newFormat: ColorFormat) => {
      setColorFormat(newFormat);
    };
    const steppersNode = computed<VNode>(() => {
      const inputProps = {
        value: props.value,
        prefixCls: props.prefixCls,
        onChange: props.onChange,
      };
      switch (colorFormat.value) {
        case ColorFormat.hsb:
          return <ColorHsbInput {...inputProps} />;
        case ColorFormat.rgb:
          return <ColorRgbInput {...inputProps} />;
        case ColorFormat.hex:
        default:
          return <ColorHexInput {...inputProps} />;
      }
    });
    return () => (
      <div class={`${colorInputPrefixCls.value}-container`}>
        <Select
          value={colorFormat.value}
          bordered={false}
          dropdownMatchSelectWidth={68}
          placement="bottomRight"
          onChange={handleFormatChange}
          class={`${props.prefixCls}-format-select`}
          size="small"
          options={selectOptions}
        />
        <div class={colorInputPrefixCls.value}>{steppersNode.value}</div>
        <ColorAlphaInput
          prefixCls={props.prefixCls}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    );
  },
});

export default ColorInput;
