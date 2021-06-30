import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';

export const skeletonTitleProps = {
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export type SkeletonTitleProps = Partial<ExtractPropTypes<typeof skeletonTitleProps>>;

const SkeletonTitle = defineComponent({
  name: 'SkeletonTitle',
  props: skeletonTitleProps,
  setup(props) {
    return () => {
      const { prefixCls, width } = props;
      const zWidth = typeof width === 'number' ? `${width}px` : width;
      return <h3 class={prefixCls} style={{ width: zWidth }} />;
    };
  },
});

export default SkeletonTitle;
