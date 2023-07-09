import type { HsbaColorType } from '../vc-color-picker';
import { computed, defineComponent } from 'vue';
import VcColorPicker from '../vc-color-picker';
import Divider from '../divider';
import type { Color } from './color';
import ColorClear from './components/ColorClear';
import ColorInput from './components/ColorInput';
import ColorPresets from './components/ColorPresets';
import type { ColorPickerBaseProps } from './interface';
import type { VueNode } from '../_util/type';

interface ColorPickerPanelProps extends ColorPickerBaseProps {
  onChange?: (value?: Color, type?: HsbaColorType) => void;
  onClear?: (clear?: boolean) => void;
}
const ColorPickerPanel = defineComponent({
  name: 'ColorPickerPanel',
  inheritAttrs: false,
  props: ['prefixCls', 'allowClear', 'presets', 'onChange', 'onClear', 'color'],
  setup(props: ColorPickerPanelProps, { attrs }) {
    const colorPickerPanelPrefixCls = computed(() => `${props.prefixCls}-inner-panel`);
    const newLocal = (panel: VueNode) => (
      <div class={colorPickerPanelPrefixCls.value}>
        {props.allowClear && (
          <ColorClear
            prefixCls={props.prefixCls}
            value={props.color}
            onChange={clearColor => {
              props.onChange?.(clearColor);
              props.onClear?.(true);
            }}
            {...attrs}
          />
        )}
        {panel}
        <ColorInput
          value={props.color}
          onChange={props.onChange}
          prefixCls={props.prefixCls}
          {...attrs}
        />
        {Array.isArray(props.presets) && (
          <>
            <Divider class={`${colorPickerPanelPrefixCls.value}-divider`} />
            <ColorPresets
              value={props.color}
              presets={props.presets}
              prefixCls={props.prefixCls}
              onChange={props.onChange}
            />
          </>
        )}
      </div>
    );
    const extraPanelRender = newLocal;
    return () => (
      <VcColorPicker
        prefixCls={props.prefixCls}
        value={props.color?.toHsb()}
        onChange={props.onChange}
        panelRender={extraPanelRender}
      />
    );
  },
});

export default ColorPickerPanel;
