import { filterEmpty } from '../_util/props-util';
const ButtonGroupProps = {
  prefixCls: {
    default: 'ant-btn-group',
    type: String,
  },
  size: {
    validator(value) {
      return ['small', 'large', 'default'].includes(value);
    },
  },
};
export { ButtonGroupProps };
export default {
  name: 'AButtonGroup',
  props: ButtonGroupProps,
  data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm',
      },
    };
  },
  computed: {
    classes() {
      const { prefixCls, size, sizeMap } = this;
      const sizeCls = sizeMap[size] || '';
      return [
        {
          [`${prefixCls}`]: true,
          [`${prefixCls}-${sizeCls}`]: sizeCls,
        },
      ];
    },
  },
  render() {
    const { classes, $slots } = this;
    return <div class={classes}>{filterEmpty($slots.default)}</div>;
  },
};
