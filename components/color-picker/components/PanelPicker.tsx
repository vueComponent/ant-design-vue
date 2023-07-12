import type { HsbaColorType } from '../../vc-color-picker';
import type { Color } from '../color';
import type { ColorPickerBaseProps } from '../interface';

import { defineComponent } from 'vue';
import VcColorPicker from '../../vc-color-picker';
import { usePanelPickerContext } from '../context';
import ColorClear from './ColorClear';
import ColorInput from './ColorInput';
export interface PanelPickerProps
  extends Pick<
    ColorPickerBaseProps,
    'prefixCls' | 'colorCleared' | 'allowClear' | 'onChangeComplete'
  > {
  value?: Color;
  onChange?: (value?: Color, type?: HsbaColorType, pickColor?: boolean) => void;
  onClear?: () => void;
}
const PanelPicker = defineComponent({
  name: 'PanelPicker',
  setup() {
    const context = usePanelPickerContext();
    return () => (
      <>
        {context.value.allowClear && (
          <ColorClear
            prefixCls={context.value.prefixCls}
            value={context.value.value}
            colorCleared={context.value.colorCleared}
            {...context.value}
            onChange={clearColor => {
              context.value.onChange?.(clearColor);
              context.value.onClear?.();
            }}
          />
        )}
        <VcColorPicker
          prefixCls={context.value.prefixCls}
          value={context.value.value?.toHsb()}
          onChange={(colorValue, type) => context.value.onChange?.(colorValue, type, true)}
          onChangeComplete={context.value.onChangeComplete}
        />
        <ColorInput {...context.value} />
      </>
    );
  },
});

export default PanelPicker;
