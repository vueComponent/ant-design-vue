import type { CSSProperties, ExtractPropTypes, FunctionalComponent } from 'vue';
import classNames from '../_util/classNames';
import { tuple } from '../_util/type';
import PropTypes from '../_util/vue-types';

export const skeletonElementProps = () => ({
  prefixCls: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(tuple('large', 'small', 'default')),
    PropTypes.number,
  ]),
  shape: PropTypes.oneOf(tuple('circle', 'square', 'round')),
  active: PropTypes.looseBool,
});

export type SkeletonElementProps = Partial<
  ExtractPropTypes<ReturnType<typeof skeletonElementProps>>
>;

const Element: FunctionalComponent<SkeletonElementProps> = props => {
  const { prefixCls, size, shape } = props;

  const sizeCls = classNames({
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-sm`]: size === 'small',
  });

  const shapeCls = classNames({
    [`${prefixCls}-circle`]: shape === 'circle',
    [`${prefixCls}-square`]: shape === 'square',
    [`${prefixCls}-round`]: shape === 'round',
  });

  const sizeStyle: CSSProperties =
    typeof size === 'number'
      ? {
          width: `${size}px`,
          height: `${size}px`,
          lineHeight: `${size}px`,
        }
      : {};

  return <span class={classNames(prefixCls, sizeCls, shapeCls)} style={sizeStyle} />;
};
Element.displayName = 'SkeletonElement';

export default Element;
