import PropTypes from '../_util/vue-types';
import { filterEmpty, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

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

const Space = {
  functional: true,
  name: 'ASpace',
  props: initDefaultProps(SpaceProps, {
    size: 'small',
    direction: 'horizontal',
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render(h, content) {
    const {
      prefixCls: customizePrefixCls,
      injections: { configProvider },
      children,
    } = content;
    const { align, size, direction } = content.props;

    const getPrefixCls = configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('space', customizePrefixCls);
    const items = filterEmpty(children);
    const len = items.length;

    if (len === 0) {
      return null;
    }

    const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;

    const someSpaceClass = [
      {
        [prefixCls]: true,
        [`${prefixCls}-${direction}`]: true,
        // [`${prefixCls}-rtl`]: directionConfig === 'rtl',
        [`${prefixCls}-align-${mergedAlign}`]: mergedAlign,
      },
    ];

    if (content.data.class) {
      someSpaceClass.push(content.data.class);
    }

    const itemClassName = `${prefixCls}-item`;
    const marginDirection = 'marginRight'; // directionConfig === 'rtl' ? 'marginLeft' : 'marginRight';

    return (
      <div {...content.data} class={someSpaceClass}>
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
  },
};

/* istanbul ignore next */
Space.install = function(Vue) {
  Vue.component(Space.name, Space);
};
export default Space;
