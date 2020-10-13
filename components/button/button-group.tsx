import { defineComponent, inject } from 'vue';
import { filterEmpty, getSlot } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import { tuple } from '../_util/type';

const ButtonGroupProps = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(tuple('small', 'large', 'default')),
};
export { ButtonGroupProps };
export default defineComponent({
  name: 'AButtonGroup',
  props: ButtonGroupProps,
  setup() {
    const configProvider = inject('configProvider', defaultConfigProvider);
    return {
      configProvider,
    };
  },
  data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm',
      },
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, size } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('btn-group', customizePrefixCls);

    // large => lg
    // small => sm
    let sizeCls = '';
    switch (size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
        break;
      default:
        break;
    }
    const classes = {
      [`${prefixCls}`]: true,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
    };
    return <div class={classes}>{filterEmpty(getSlot(this))}</div>;
  },
});
