import type { BaseColorPickerProps, HsbaColorType } from '../interface';

import { computed, defineComponent, ref, shallowRef, watchEffect } from 'vue';

import classNames from '../../_util/classNames';

import { calculateColor, calculateOffset } from '../util';
import useColorDrag from '../hooks/useColorDrag';
import Palette from './Palette';
import Gradient from './Gradient';
import Handler from './Handler';
import Transform from './Transform';

interface SliderProps extends BaseColorPickerProps {
  gradientColors: string[];
  direction?: string;
  type?: HsbaColorType;
  value?: string;
}
const Slider = defineComponent({
  name: 'Slider',
  props: [
    'gradientColors',
    'direction',
    'type',
    'value',
    'color',
    'onChange',
    'onChangeComplete',
    'disabled',
    'prefixCls',
  ],
  setup(props: SliderProps) {
    const sliderRef = shallowRef();
    const transformRef = shallowRef();
    const colorRef = ref(props.color);
    const type = computed(() => props.type || 'hue');
    const direction = computed<any>(() => props.direction || 'x');
    const disabledDrag = computed(() => props.disabled);
    watchEffect(() => {
      colorRef.value = props.color;
    });
    const [offset, dragStartHandle] = useColorDrag({
      colorRef,
      targetRef: transformRef,
      containerRef: sliderRef,
      calculate: containerRef => calculateOffset(containerRef, transformRef, colorRef, type.value),
      onDragChange: offsetValue => {
        const calcColor = calculateColor({
          offset: offsetValue,
          targetRef: transformRef,
          containerRef: sliderRef,
          color: props.color,
          type: type.value,
        });
        colorRef.value = calcColor;
        props?.onChange(calcColor);
      },
      onDragChangeComplete() {
        props.onChangeComplete?.(colorRef.value, type.value);
      },
      direction,
      disabledDrag,
    });

    return () => (
      <div
        ref={sliderRef}
        class={classNames(`${props.prefixCls}-slider`, `${props.prefixCls}-slider-${type.value}`)}
        onMousedown={dragStartHandle}
        onTouchstart={dragStartHandle}
      >
        <Palette prefixCls={props.prefixCls}>
          <Transform offset={offset.value} ref={transformRef}>
            <Handler size="small" color={props.value} prefixCls={props.prefixCls} />
          </Transform>
          <Gradient
            colors={props.gradientColors}
            direction={props.direction}
            type={props.type}
            prefixCls={props.prefixCls}
          />
        </Palette>
      </div>
    );
  },
});

export default Slider;
