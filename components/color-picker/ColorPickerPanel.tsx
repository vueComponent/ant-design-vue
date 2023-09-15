import type { HsbaColorType } from '../vc-color-picker';
import type { ColorPickerBaseProps } from './interface';
import type { Color } from './color';

import { computed, defineComponent, provide } from 'vue';
import { PanelPickerContext, PanelPresetsContext } from './context';
import Divider from '../divider';
import PanelPicker from './components/PanelPicker';
import PanelPresets from './components/PanelPresets';
import type { VueNode } from '../_util/type';

export type PanelRender = (
  innerPanel: VueNode,
  {
    components,
  }: {
    components: { Picker: typeof PanelPicker; Presets: typeof PanelPresets };
  },
) => VueNode;

interface ColorPickerPanelProps extends ColorPickerBaseProps {
  onChange?: (value?: Color, type?: HsbaColorType) => void;
  onClear?: (clear?: boolean) => void;
  panelRender?: PanelRender;
}

const ColorPickerPanel = defineComponent({
  name: 'ColorPickerPanel',
  inheritAttrs: false,
  props: ['prefixCls', 'presets', 'onChange', 'onClear', 'color', 'panelRender'],
  setup(props: ColorPickerPanelProps, { attrs }) {
    const colorPickerPanelPrefixCls = computed(() => `${props.prefixCls}-inner-content`);
    // ==== Inject props ===
    const panelPickerProps = computed(() => ({
      prefixCls: props.prefixCls,
      value: props.color,
      onChange: props.onChange,
      onClear: props.onClear,
      ...attrs,
    }));
    const panelPresetsProps = computed(() => ({
      prefixCls: props.prefixCls,
      value: props.color,
      presets: props.presets,
      onChange: props.onChange,
    }));
    // ==== Inject ===
    provide(PanelPickerContext, panelPickerProps);
    provide(PanelPresetsContext, panelPresetsProps);
    // ==== Render ===
    const innerPanel = computed(() => (
      <>
        <PanelPicker />
        {Array.isArray(props.presets) && (
          <Divider class={`${colorPickerPanelPrefixCls.value}-divider`} />
        )}
        <PanelPresets />
      </>
    ));
    return () => (
      <div class={colorPickerPanelPrefixCls.value}>
        {typeof props.panelRender === 'function'
          ? props.panelRender(innerPanel.value, {
              components: { Picker: PanelPicker, Presets: PanelPresets } as any,
            })
          : innerPanel.value}
      </div>
    );
  },
});

export default ColorPickerPanel;
