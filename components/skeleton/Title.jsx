import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';

const skeletonTitleProps = {
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export const SkeletonTitleProps = PropTypes.shape(skeletonTitleProps);

const Title = {
  props: initDefaultProps(skeletonTitleProps, {
    prefixCls: 'ant-skeleton-title',
  }),
  render() {
    const { prefixCls, width } = this.$props;
    const zWidth = typeof width === 'number' ? `${width}px` : width;
    return <h3 class={prefixCls} style={{ width: zWidth }} />;
  },
};

export default Title;
