import type { CSSProperties } from 'vue';
import { defineComponent } from 'vue';

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
  props: ['color', 'prefixCls', 'onClick'],
  setup(props: ColorBlockProps) {
    const colorBlockCls = `${props.prefixCls}-color-block`;
    return () => (
      <div class={classNames(colorBlockCls)} onClick={props.onClick}>
        <div
          class={`${colorBlockCls}-inner`}
          style={{
            background: props.color,
          }}
        />
      </div>
    );
  },
});

export default ColorBlock;
