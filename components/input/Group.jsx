import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';

export default {
  name: 'AInputGroup',
  props: {
    prefixCls: PropTypes.string,
    size: {
      validator(value) {
        return ['small', 'large', 'default'].includes(value);
      },
    },
    compact: PropTypes.looseBool,
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  computed: {
    classes() {
      const { prefixCls: customizePrefixCls, size, compact = false } = this;
      const getPrefixCls = this.configProvider.getPrefixCls;
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
};
