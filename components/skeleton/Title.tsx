import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';

export const skeletonTitleProps = () => ({
  prefixCls: String,
  width: { type: [Number, String] as PropType<string | number> },
});

export type SkeletonTitleProps = Partial<ExtractPropTypes<ReturnType<typeof skeletonTitleProps>>>;

const SkeletonTitle = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SkeletonTitle',
  props: skeletonTitleProps(),
  setup(props) {
    return () => {
      const { prefixCls, width } = props;
      const zWidth = typeof width === 'number' ? `${width}px` : width;
      return <h3 class={prefixCls} style={{ width: zWidth }} />;
    };
  },
});

export default SkeletonTitle;
