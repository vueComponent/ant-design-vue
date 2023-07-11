import type { Color } from '../color';
import type { HsbaColorType } from '../interface';

import { computed, defineComponent } from 'vue';

import { generateColor } from '../util';

interface ColorBlockProps {
  colors: (Color | string)[];
  direction?: string;
  type?: HsbaColorType;
  prefixCls?: string;
}

const Gradient = defineComponent({
  name: 'ColorBlock',
  props: ['direction', 'prefixCls', 'type', 'colors'],
  setup(props: ColorBlockProps, { slots }) {
    const direction = computed(() => props.direction || 'to right');
    const gradientColors = computed(() => {
      const { colors, type } = props;
      return colors
        .map((color, idx) => {
          const result = generateColor(color);
          if (type === 'alpha' && idx === colors.length - 1) {
            result.setAlpha(1);
          }
          return result.toRgbString();
        })
        .join(',');
    });
    return () => (
      <div
        class={`${props.prefixCls}-gradient`}
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${direction.value}, ${gradientColors.value})`,
        }}
      >
        {slots.children?.()}
      </div>
    );
  },
});

export default Gradient;
