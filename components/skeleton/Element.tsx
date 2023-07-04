import type { CSSProperties, ExtractPropTypes, FunctionalComponent, PropType } from 'vue';
import classNames from '../_util/classNames';

export const skeletonElementProps = () => ({
  prefixCls: String,
  size: [String, Number] as PropType<'large' | 'small' | 'default' | number>,
  shape: String as PropType<'circle' | 'square' | 'round' | 'default'>,
  active: { type: Boolean, default: undefined },
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
