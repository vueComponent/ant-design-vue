import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export const SpaceSizeType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.oneOf(['small', 'middle', 'large']),
]);

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

export const SpaceProps = {
  prefixCls: PropTypes.string,
  size: SpaceSizeType,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  align: PropTypes.oneOf(['start', 'end', 'center', 'baseline']),
};

const Space = (props, { slots }) => {
  const configProvider = inject('configProvider', ConfigConsumerProps);
  const { align, size, direction, prefixCls: customizePrefixCls } = props;

  const getPrefixCls = configProvider.getPrefixCls;
  const prefixCls = getPrefixCls('space', customizePrefixCls);
  const items = filterEmpty(slots.default && slots.default());
  const len = items.length;

  if (len === 0) {
    return null;
  }

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;

  const someSpaceClass = {
    [prefixCls]: true,
    [`${prefixCls}-${direction}`]: true,
    // [`${prefixCls}-rtl`]: directionConfig === 'rtl',
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
Space.install = function(app) {
  app.component('ASpace', Space);
};
export default Space;
