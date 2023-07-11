import type { ColorPickerBaseProps } from '../interface';
import type { Color } from '../color';

import { defineComponent } from 'vue';

import { generateColor } from '../util';

interface ColorClearProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  value?: Color;
  colorCleared?: boolean;
  onChange?: (value: Color) => void;
}
const ColorClear = defineComponent({
  name: 'ColorClear',
  props: ['prefixCls', 'value', 'onChange', 'colorCleared'],
  setup(props: ColorClearProps) {
    const handleClick = () => {
      if (props.value && !props.colorCleared) {
        const hsba = props.value.toHsb();
        hsba.a = 0;
        const genColor = generateColor(hsba);
        props.onChange?.(genColor);
      }
    };
    return () => <div class={`${props.prefixCls}-clear`} onClick={handleClick} />;
  },
});
export default ColorClear;
