import { defineComponent, ref, shallowRef } from 'vue';
import useColorDrag from '../hooks/useColorDrag';
import type { BaseColorPickerProps } from '../interface';
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
    const transformRef = shallowRef<HTMLDivElement>();
    const colorRef = ref(props.color);
    const [offset, dragStartHandle] = useColorDrag({
      color: props.color,
      containerRef: pickerRef,
      targetRef: transformRef,
      calculate: containerRef => calculateOffset(containerRef, transformRef, props.color),
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
      disabledDrag: props.disabled,
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
