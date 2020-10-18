import { defineComponent, ExtractPropTypes } from 'vue';
import PropTypes from '../_util/vue-types';

const skeletonTitleProps = {
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export const SkeletonTitleProps = PropTypes.shape(skeletonTitleProps);

export type ISkeletonTitleProps = Partial<ExtractPropTypes<typeof skeletonTitleProps>>;

const Title = defineComponent({
  props: skeletonTitleProps,
  render() {
    const { prefixCls, width } = this.$props;
    const zWidth = typeof width === 'number' ? `${width}px` : width;
    return <h3 class={prefixCls} style={{ width: zWidth }} />;
  },
});

export default Title;
