import { defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import { getSlot } from '../_util/props-util';

export default defineComponent({
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: {
    prefixCls: PropTypes.string,
    hoverable: PropTypes.looseBool,
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, hoverable = true } = this.$props;

    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const classString = {
      [`${prefixCls}-grid`]: true,
      [`${prefixCls}-grid-hoverable`]: hoverable,
    };
    return <div class={classString}>{getSlot(this)}</div>;
  },
});
