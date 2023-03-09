import type { CSSProperties } from 'vue';
import { defineComponent, toRefs } from 'vue';
import { formatClassName } from '../../utils/format';

export interface PointerProps {
  top?: number;
  left: number;
  color: string;
}

export const Pointer = defineComponent({
  name: 'Pointer',
  props: {
    top: { type: Number, default: 0.5 },
    left: { type: Number },
    color: { type: String },
  },
  setup(props, { attrs }) {
    const { color, left, top } = toRefs(props);

    return () => {
      const nodeClassName = formatClassName(['vue-colorful__pointer', attrs.class]);

      const style = {
        top: `${top.value * 100}%`,
        left: `${left.value * 100}%`,
        ...(attrs.style as CSSProperties),
      };

      return (
        <div {...attrs} class={nodeClassName} style={style}>
          <div class="vue-colorful__pointer-fill" style={{ backgroundColor: color.value }} />
        </div>
      );
    };
  },
});
