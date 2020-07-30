import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'AInputGroup',
  props: {
    prefixCls: PropTypes.string,
    size: {
      validator(value) {
        return ['small', 'large', 'default'].includes(value);
      },
    },
    compact: Boolean,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
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
