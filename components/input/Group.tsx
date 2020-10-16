import { defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import { tuple } from '../_util/type';

export default defineComponent({
  name: 'AInputGroup',
  props: {
    prefixCls: PropTypes.string,
    size: PropTypes.oneOf(tuple('small', 'large', 'default')),
    compact: PropTypes.looseBool,
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  computed: {
    classes() {
      const { prefixCls: customizePrefixCls, size, compact = false, configProvider } = this as any;
      const getPrefixCls = configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('input-group', customizePrefixCls);

      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-compact`]: compact,
      };
    },
  },
  render() {
    return <span class={this.classes}>{getSlot(this)}</span>;
  },
});
