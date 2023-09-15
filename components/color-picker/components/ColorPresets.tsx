import type { ColorPickerBaseProps, PresetsItem } from '../interface';
import type { Color } from '../color';

import { computed, defineComponent } from 'vue';

import { useConfigContextInject } from '../../config-provider/context';
import Collapse from '../../collapse';
import useMergedState from '../../_util/hooks/useMergedState';
import { ColorBlock } from '../../vc-color-picker';
import { generateColor } from '../util';
import classNames from '../../_util/classNames';

const { Panel } = Collapse;
interface ColorPresetsProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  presets: PresetsItem[];
  value?: Color;
  color?: Color;
  onChange?: (value: Color) => void;
}

const genPresetColor = (list: PresetsItem[]) =>
  list.map(value => {
    value.colors = value.colors.map(generateColor);
    return value;
  });

const isBright = (value: Color) => {
  const { r, g, b, a } = value.toRgb();
  if (a <= 0.5) {
    return true;
  }
  return r * 0.299 + g * 0.587 + b * 0.114 > 192;
};
const ColorPresets = defineComponent({
  name: 'ColorPresets',
  props: ['prefixCls', 'presets', 'value', 'onChange', 'color'],
  setup(props: ColorPresetsProps) {
    const conetext = useConfigContextInject();
    const locale = computed(() => conetext.locale.value.ColorPicker);
    const colorPresetsPrefixCls = computed(() => `${props.prefixCls}-presets`);
    const presets = computed(() => genPresetColor(props.presets));
    const [presetsValue] = useMergedState(genPresetColor(props.presets), {
      value: presets,
      postState: genPresetColor,
    });
    const activeKeys = computed(() => presetsValue.value.map(preset => `panel-${preset.label}`));
    const handleClick = (colorValue: Color) => {
      props.onChange?.(colorValue);
    };
    return () => (
      <div class={colorPresetsPrefixCls.value}>
        <Collapse defaultActiveKey={activeKeys.value} ghost>
          {presetsValue.value.map(preset => (
            <Panel
              header={<div class={`${colorPresetsPrefixCls.value}-label`}>{preset?.label}</div>}
              key={`panel-${preset?.label}`}
            >
              <div class={`${colorPresetsPrefixCls.value}-items`}>
                {Array.isArray(preset?.colors) && preset.colors?.length > 0 ? (
                  preset.colors.map((presetColor: Color) => (
                    <ColorBlock
                      key={`preset-${presetColor.toHexString()}`}
                      color={generateColor(presetColor).toRgbString()}
                      prefixCls={props.prefixCls}
                      class={classNames(`${colorPresetsPrefixCls.value}-color`, {
                        [`${colorPresetsPrefixCls.value}-color-checked`]:
                          presetColor.toHexString() === props.color?.toHexString(),
                        [`${colorPresetsPrefixCls.value}-color-bright`]: isBright(presetColor),
                      })}
                      onClick={() => handleClick(presetColor)}
                    />
                  ))
                ) : (
                  <span class={`${colorPresetsPrefixCls.value}-empty`}>
                    {locale.value.presetEmpty}
                  </span>
                )}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  },
});

export default ColorPresets;
