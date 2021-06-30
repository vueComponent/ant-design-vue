import { computed, defineComponent } from 'vue';
import { flattenChildren } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../_util/hooks/useConfigInject';

import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';

const buttonGroupProps = {
  prefixCls: PropTypes.string,
  size: {
    type: String as PropType<SizeType>,
  },
};
export { buttonGroupProps };

export type ButtonGroupProps = Partial<ExtractPropTypes<typeof buttonGroupProps>>;

export default defineComponent({
  name: 'AButtonGroup',
  props: buttonGroupProps,
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('btn-group', props);
    const classes = computed(() => {
      const { size } = props;
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
      return {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-${sizeCls}`]: sizeCls,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      };
    });
    return () => {
      return <div class={classes.value}>{flattenChildren(slots.default?.())}</div>;
    };
  },
});
