import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ACheckableTag',
  props: {
    prefixCls: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    'onUpdate:checked': PropTypes.func,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  computed: {
    classes() {
      const { checked, prefixCls: customizePrefixCls } = this;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('tag', customizePrefixCls);
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checkable`]: true,
        [`${prefixCls}-checkable-checked`]: checked,
      };
    },
  },
  methods: {
    handleClick() {
      const { checked } = this;
      this.$emit('update:checked', !checked);
      this.$emit('change', !checked);
    },
  },
  render() {
    const { classes, handleClick, $slots } = this;
    return (
      <div class={classes} onClick={handleClick}>
        {$slots.default && $slots.default()}
      </div>
    );
  },
};
