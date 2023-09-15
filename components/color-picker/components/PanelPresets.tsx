import type { Color } from '../color';
import type { ColorPickerBaseProps } from '../interface';
import { defineComponent } from 'vue';
import { usePanelPresetsContext } from '../context';
import ColorPresets from './ColorPresets';

export interface PanelPresetsProps extends Pick<ColorPickerBaseProps, 'prefixCls' | 'presets'> {
  value?: Color;
  onChange?: (value: Color) => void;
}
const PanelPresets = defineComponent({
  name: 'PanelPresets',
  setup() {
    const context = usePanelPresetsContext();
    return () =>
      Array.isArray(context.value.presets) ? (
        <ColorPresets
          value={context.value.value}
          presets={context.value.presets}
          prefixCls={context.value.prefixCls}
          onChange={context.value.onChange}
        />
      ) : null;
  },
});
export default PanelPresets;
