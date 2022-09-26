import { computed, defineComponent } from 'vue';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';

import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';
import UnreachableException from '../_util/unreachableException';

export const buttonGroupProps = () => ({
  prefixCls: String,
  size: {
    type: String as PropType<SizeType>,
  },
});

export type ButtonGroupProps = Partial<ExtractPropTypes<ReturnType<typeof buttonGroupProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AButtonGroup',
  props: buttonGroupProps(),
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
        case 'middle':
        case undefined:
          break;
        default:
          // eslint-disable-next-line no-console
          console.warn(new UnreachableException(size).error);
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
