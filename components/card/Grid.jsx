import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';
import { getSlot } from '../_util/props-util';

export default {
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: {
    prefixCls: PropTypes.string,
    hoverable: PropTypes.bool,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, hoverable = true } = this.$props;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const classString = {
      [`${prefixCls}-grid`]: true,
      [`${prefixCls}-grid-hoverable`]: hoverable,
    };
    return <div class={classString}>{getSlot(this)}</div>;
  },
};
