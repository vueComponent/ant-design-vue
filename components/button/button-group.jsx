import { filterEmpty } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

const ButtonGroupProps = {
  prefixCls: PropTypes.string,
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
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
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
    const { prefixCls: customizePrefixCls, size, $slots } = this;
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
    return <div class={classes}>{filterEmpty($slots.default)}</div>;
  },
};
