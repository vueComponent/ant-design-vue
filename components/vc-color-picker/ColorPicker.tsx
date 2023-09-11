import { defineComponent, type CSSProperties, computed, shallowRef } from 'vue';
import type { BaseColorPickerProps, ColorGenInput } from './interface';
import type { VueNode } from '../_util/type';

import { ColorPickerPrefixCls, defaultColor, generateColor } from './util';
import classNames from '../_util/classNames';

import ColorBlock from './components/ColorBlock';
import Picker from './components/Picker';
import Slider from './components/Slider';
import useColorState from './hooks/useColorState';

const hueColor = [
  'rgb(255, 0, 0) 0%',
  'rgb(255, 255, 0) 17%',
  'rgb(0, 255, 0) 33%',
  'rgb(0, 255, 255) 50%',
  'rgb(0, 0, 255) 67%',
  'rgb(255, 0, 255) 83%',
  'rgb(255, 0, 0) 100%',
];

export interface ColorPickerProps extends BaseColorPickerProps {
  value?: ColorGenInput;
  defaultValue?: ColorGenInput;
  className?: string;
  style?: CSSProperties;
  /** Get panel element  */
  panelRender?: (panel: VueNode) => VueNode;
  /** Disabled alpha selection */
  disabledAlpha?: boolean;
}

const ColorPicker = defineComponent({
  name: 'VcColorPicker',
  props: [
    'value',
    'defaultValue',
    'prefixCls',
    'onChange',
    'onChangeComplete',
    'panelRender',
    'disabledAlpha',
    'disabled',
  ],
  emits: ['change', 'changeComplete'],
  setup(props, { expose }) {
    const disabledAlpha = computed(() => props.disabledAlpha || false);
    const disabled = computed(() => props.disabled || false);
    const prefixCls = computed(() => props.prefixCls || ColorPickerPrefixCls);
    const value = computed(() => props.value);
    const colorPickerRef = shallowRef();
    const [colorValue, setColorValue] = useColorState(defaultColor, {
      value,
      defaultValue: props.defaultValue,
    });

    const alphaColor = computed(() => {
      const rgb = generateColor(colorValue.value.toRgbString());
      // alpha color need equal 1 for base color
      rgb.setAlpha(1);
      return rgb.toRgbString();
    });
    const mergeCls = computed(() =>
      classNames(`${prefixCls.value}-panel`, {
        [`${prefixCls.value}-panel-disabled`]: disabled.value,
      }),
    );
    const basicProps = computed(() => ({
      prefixCls: prefixCls.value,
      onChangeComplete: props.onChangeComplete,
      disabled: disabled.value,
    }));

    const handleChange: BaseColorPickerProps['onChange'] = (data, type) => {
      if (!props.value) {
        setColorValue(data);
      }
      props.onChange?.(data, type);
    };
    const defaultPanel = computed(() => (
      <>
        <Picker color={colorValue.value} onChange={handleChange} {...basicProps.value} />
        <div class={`${prefixCls.value}-slider-container`}>
          <div
            class={classNames(`${prefixCls.value}-slider-group`, {
              [`${prefixCls.value}-slider-group-disabled-alpha`]: disabledAlpha.value,
            })}
          >
            <Slider
              gradientColors={hueColor}
              color={colorValue.value}
              value={`hsl(${colorValue.value.toHsb().h},100%, 50%)`}
              onChange={color => handleChange(color, 'hue')}
              {...basicProps.value}
            />
            {!disabledAlpha.value && (
              <Slider
                type="alpha"
                gradientColors={['rgba(255, 0, 4, 0) 0%', alphaColor.value]}
                color={colorValue.value}
                value={colorValue.value.toRgbString()}
                onChange={color => handleChange(color, 'alpha')}
                {...basicProps.value}
              />
            )}
          </div>
          <ColorBlock color={colorValue.value.toRgbString()} prefixCls={prefixCls.value} />
        </div>
      </>
    ));

    expose({
      colorPickerRef,
    });

    return () => {
      return (
        <div class={mergeCls.value} ref={colorPickerRef}>
          {typeof props.panelRender === 'function'
            ? props.panelRender(defaultPanel.value)
            : defaultPanel.value}
        </div>
      );
    };
  },
});

export default ColorPicker;
