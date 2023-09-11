import type { VueNode } from '../../_util/type';
import type { ColorPickerBaseProps } from '../interface';

import { computed, defineComponent, shallowRef } from 'vue';

import { ColorBlock } from '../../vc-color-picker';
import classNames from '../../_util/classNames';

import ColorClear from './ColorClear';
import { getAlphaColor } from '../util';

interface colorTriggerProps
  extends Pick<ColorPickerBaseProps, 'prefixCls' | 'colorCleared' | 'disabled'> {
  color: Exclude<ColorPickerBaseProps['color'], undefined>;
  open?: boolean;
  showText?: boolean | ((color: ColorPickerBaseProps['color']) => VueNode);
  format?: 'hex' | 'hsb' | 'rgb';
}

const ColorTrigger = defineComponent({
  name: 'ColorTrigger',
  props: ['prefixCls', 'colorCleared', 'disabled', 'color', 'open', 'showText', 'format'],
  setup(props: colorTriggerProps, { expose }) {
    const colorTriggerPrefixCls = computed(() => `${props.prefixCls}-trigger`);
    const containerNode = computed<VueNode>(() =>
      props.colorCleared ? (
        <ColorClear prefixCls={props.prefixCls} />
      ) : (
        <ColorBlock prefixCls={props.prefixCls} color={props.color.toRgbString()} />
      ),
    );

    const genColorString = () => {
      const hexString = props.color.toHexString().toUpperCase();
      const alpha = getAlphaColor(props.color);
      switch (props.format) {
        case 'rgb':
          return props.color.toRgbString();
        case 'hsb':
          return props.color.toHsbString();
        case 'hex':
        default:
          return alpha < 100 ? `${hexString.slice(0, 7)},${alpha}%` : hexString;
      }
    };

    const colorTriggerRef = shallowRef<HTMLDivElement>();

    const renderText = computed(() => {
      if (typeof props.showText === 'function') {
        return props.showText(props.color);
      }
      if (props.showText) {
        return genColorString();
      }
      return null;
    });
    expose({
      colorTriggerRef,
    });

    return () => (
      <div
        ref={colorTriggerRef}
        class={classNames(colorTriggerPrefixCls.value, {
          [`${colorTriggerPrefixCls.value}-active`]: props.open,
          [`${colorTriggerPrefixCls.value}-disabled`]: props.disabled,
        })}
      >
        {containerNode.value}
        {props.showText && (
          <div class={`${colorTriggerPrefixCls.value}-text`}>{renderText.value}</div>
        )}
      </div>
    );
  },
});

export default ColorTrigger;
