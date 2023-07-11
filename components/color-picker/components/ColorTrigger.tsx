import type { VueNode } from '../../_util/type';
import type { ColorPickerBaseProps } from '../interface';

import { computed, defineComponent, shallowRef } from 'vue';

import { ColorBlock } from '../../vc-color-picker';
import classNames from '../../_util/classNames';

import ColorClear from './ColorClear';

interface colorTriggerProps
  extends Pick<ColorPickerBaseProps, 'prefixCls' | 'colorCleared' | 'disabled'> {
  color: Exclude<ColorPickerBaseProps['color'], undefined>;
  open?: boolean;
}

const ColorTrigger = defineComponent({
  name: 'ColorTrigger',
  props: ['prefixCls', 'colorCleared', 'disabled', 'color', 'open'],
  setup(props: colorTriggerProps, { expose }) {
    const colorTriggerPrefixCls = computed(() => `${props.prefixCls}-trigger`);
    const containerNode = computed<VueNode>(() =>
      props.colorCleared ? (
        <ColorClear prefixCls={props.prefixCls} />
      ) : (
        <ColorBlock prefixCls={props.prefixCls} color={props.color.toRgbString()} />
      ),
    );

    const colorTriggerRef = shallowRef<HTMLDivElement>();
    expose({
      getRef: () => colorTriggerRef.value,
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
      </div>
    );
  },
});

export default ColorTrigger;
