import { inject, App, CSSProperties, SetupContext } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import { filterEmpty } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

// export const SpaceProps = {
//   prefixCls: PropTypes.string,
//   align: PropTypes.tuple<'start' | 'end' | 'center' | 'baseline'>(),
//   size: PropTypes.tuple<'small' | 'middle' | 'large'>(),
//   direction: PropTypes.tuple<'horizontal' | 'vertical'>(),
// };

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

export interface SpaceProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  size?: SizeType | number;
  direction?: 'horizontal' | 'vertical';
  // No `stretch` since many components do not support that.
  align?: 'start' | 'end' | 'center' | 'baseline';
}

const Space = (props: SpaceProps, { slots }: SetupContext) => {
  const configProvider = inject('configProvider', ConfigConsumerProps);
  const { align, size, direction, prefixCls: customizePrefixCls } = props;

  const { getPrefixCls } = configProvider;
  const prefixCls = getPrefixCls('space', customizePrefixCls);
  const items = filterEmpty(slots.default?.());
  const len = items.length;

  if (len === 0) {
    return null;
  }

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;

  const someSpaceClass = {
    [prefixCls]: true,
    [`${prefixCls}-${direction}`]: true,
    [`${prefixCls}-align-${mergedAlign}`]: mergedAlign,
  };

  const itemClassName = `${prefixCls}-item`;
  const marginDirection = 'marginRight'; // directionConfig === 'rtl' ? 'marginLeft' : 'marginRight';

  return (
    <div class={someSpaceClass}>
      {items.map((child, i) => (
        <div
          class={itemClassName}
          key={`${itemClassName}-${i}`}
          style={
            i === len - 1
              ? {}
              : {
                  [direction === 'vertical' ? 'marginBottom' : marginDirection]:
                    typeof size === 'string' ? `${spaceSize[size]}px` : `${size}px`,
                }
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
};
Space.props = initDefaultProps(SpaceProps, {
  size: 'small',
  direction: 'horizontal',
});

/* istanbul ignore next */
Space.install = function(app: App) {
  app.component('ASpace', Space);
};

export default Space;
