import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { getListeners } from '../_util/props-util';

export default {
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: {
    prefixCls: PropTypes.string,
    hoverable: PropTypes.bool,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render() {
    const { prefixCls: customizePrefixCls, hoverable = true } = this.$props;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const classString = {
      [`${prefixCls}-grid`]: true,
      [`${prefixCls}-grid-hoverable`]: hoverable,
    };
    return (
      <div {...{ on: getListeners(this) }} class={classString}>
        {this.$slots.default}
      </div>
    );
  },
};
