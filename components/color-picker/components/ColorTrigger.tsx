import { ColorBlock } from '../../vc-color-picker';
import type { VueNode } from '../../_util/type';
import classNames from '../../_util/classNames';
import { computed, defineComponent, type CSSProperties, shallowRef } from 'vue';
import type { ColorPickerBaseProps } from '../interface';
import ColorClear from './ColorClear';

interface colorTriggerProps
  extends Pick<ColorPickerBaseProps, 'prefixCls' | 'colorCleared' | 'disabled'> {
  color: Exclude<ColorPickerBaseProps['color'], undefined>;
  open?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent) => void;
  onMouseenter?: (e: MouseEvent) => void;
  onMouseleave?: (e: MouseEvent) => void;
}
const ColorTrigger = defineComponent({
  name: 'ColorTrigger',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'colorCleared',
    'disabled',
    'color',
    'open',
    'onClick',
    'onMouseenter',
    'onMouseleave',
    'onMousedown',
  ],
  setup(props: colorTriggerProps, { expose, attrs }) {
    const colorTriggerPrefixCls = computed(() => `${props.prefixCls}-trigger`);
    const containerNode = computed<VueNode>(() =>
      props.colorCleared ? (
        <ColorClear prefixCls={props.prefixCls} />
      ) : (
        <ColorBlock
          prefixCls={props.prefixCls}
          color={props.color.toRgbString()}
          onClick={props.onClick}
        />
      ),
    );

    const colorTriggerRef = shallowRef<HTMLDivElement>();
    expose({
      getRef: () => colorTriggerRef.value,
    });

    return () => (
      <div
        ref={colorTriggerRef}
        {...attrs}
        class={classNames(colorTriggerPrefixCls.value, attrs.class, {
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
