import { computed, defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import { InputSizeType } from './inputProps';

export default defineComponent({
  name: 'AInputGroup',
  props: {
    prefixCls: PropTypes.string,
    size: PropTypes.oneOf(InputSizeType),
    compact: PropTypes.looseBool,
  },
  setup(props, { slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const classes = computed(() => {
      const { prefixCls: customizePrefixCls, size, compact = false } = props;
      const getPrefixCls = configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('input-group', customizePrefixCls);

      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-compact`]: compact,
      };
    });

    return () => <span class={classes.value}>{slots.default?.()}</span>;
  },
});
