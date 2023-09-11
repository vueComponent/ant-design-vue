import type { BaseColorPickerProps } from '../interface';
import { computed, defineComponent, ref, shallowRef, watchEffect } from 'vue';

import useColorDrag from '../hooks/useColorDrag';
import { calculateColor, calculateOffset } from '../util';

import Handler from './Handler';
import Palette from './Palette';
import Transform from './Transform';

export type PickerProps = BaseColorPickerProps;

const Picker = defineComponent({
  name: 'Picker',
  props: ['color', 'prefixCls', 'onChange', 'onChangeComplete', 'disabled'],
  setup(props: PickerProps) {
    const pickerRef = shallowRef<HTMLDivElement>();
    const transformRef = shallowRef<{ transformDomRef: HTMLDivElement }>();
    const colorRef = ref(props.color);
    const disabledDrag = computed(() => props.disabled);
    watchEffect(() => {
      colorRef.value = props.color;
    });
    const [offset, dragStartHandle] = useColorDrag({
      colorRef,
      containerRef: pickerRef,
      targetRef: transformRef,
      calculate: containerRef => calculateOffset(containerRef, transformRef, colorRef),
      onDragChange: offsetValue => {
        const calcColor = calculateColor({
          offset: offsetValue,
          targetRef: transformRef,
          containerRef: pickerRef,
          color: props.color,
        });
        colorRef.value = calcColor;
        props?.onChange(calcColor);
      },
      onDragChangeComplete: () => props?.onChangeComplete?.(colorRef.value),
      disabledDrag,
    });
    return () => (
      <div
        ref={pickerRef}
        class={`${props.prefixCls}-select`}
        onMousedown={dragStartHandle}
        onTouchstart={dragStartHandle}
      >
        <Palette prefixCls={props.prefixCls}>
          <Transform offset={offset.value} ref={transformRef}>
            <Handler color={props.color.toRgbString()} prefixCls={props.prefixCls} />
          </Transform>
          <div
            class={`${props.prefixCls}-saturation`}
            style={{
              backgroundColor: `hsl(${props.color.toHsb().h},100%, 50%)`,
              backgroundImage:
                'linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))',
            }}
          />
        </Palette>
      </div>
    );
  },
});

export default Picker;
