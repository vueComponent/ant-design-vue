import { inject, defineComponent, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import { defaultConfigProvider, SizeType } from '../config-provider';
import { tuple, withInstall } from '../_util/type';

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

const Space = defineComponent({
  name: 'ASpace',
  props: {
    prefixCls: PropTypes.string,
    size: {
      type: [String, Number] as PropType<number | SizeType>,
    },
    direction: PropTypes.oneOf(tuple('horizontal', 'vertical')),
    align: PropTypes.oneOf(tuple('start', 'end', 'center', 'baseline')),
  },
  setup(props, { slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);

    return () => {
      const {
        align,
        size = 'small',
        direction = 'horizontal',
        prefixCls: customizePrefixCls,
      } = props;

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
  },
});

export default withInstall(Space);
