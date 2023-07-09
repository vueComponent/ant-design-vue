import type { CSSProperties } from 'vue';
import { computed, defineComponent } from 'vue';

import classNames from '../../_util/classNames';

export type ColorBlockProps = {
  color: string;
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent) => void;
};

const ColorBlock = defineComponent({
  name: 'ColorBlock',
  inheritAttrs: false,
  props: ['color', 'prefixCls', 'onClick'],
  setup(props: ColorBlockProps) {
    const colorBlockCls = computed(() => `${props.prefixCls}-color-block`);

    return () => (
      <div class={classNames(colorBlockCls.value)} onClick={props.onClick}>
        <div
          class={`${colorBlockCls.value}-inner`}
          style={{
            background: props.color,
          }}
        />
      </div>
    );
  },
});

export default ColorBlock;
