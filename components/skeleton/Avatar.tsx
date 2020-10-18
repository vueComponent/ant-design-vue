import { defineComponent, ExtractPropTypes } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import initDefaultProps from '../_util/props-util/initDefaultProps';

const skeletonAvatarProps = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(tuple('large', 'small', 'default')),
    PropTypes.number,
  ]),
  shape: PropTypes.oneOf(tuple('circle', 'square')),
};

export const SkeletonAvatarProps = PropTypes.shape(skeletonAvatarProps).loose;

export type ISkeletonAvatarProps = Partial<ExtractPropTypes<typeof skeletonAvatarProps>>;

const Avatar = defineComponent({
  props: initDefaultProps(skeletonAvatarProps, {
    size: 'large',
  }),
  render() {
    const { prefixCls, size, shape } = this.$props;

    const sizeCls = classNames({
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
    });

    const shapeCls = classNames({
      [`${prefixCls}-circle`]: shape === 'circle',
      [`${prefixCls}-square`]: shape === 'square',
    });

    const sizeStyle =
      typeof size === 'number'
        ? {
            width: `${size}px`,
            height: `${size}px`,
            lineHeight: `${size}px`,
          }
        : {};

    return <span class={classNames(prefixCls, sizeCls, shapeCls)} style={sizeStyle} />;
  },
});

export default Avatar;
