import { defineComponent } from 'vue';
import { flattenChildren } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';

const ButtonGroupProps = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(tuple('small', 'large', 'default')),
};
export { ButtonGroupProps };
export default defineComponent({
  name: 'AButtonGroup',
  props: ButtonGroupProps,
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('btn-group', props);

    return () => {
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
      const classes = {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-${sizeCls}`]: sizeCls,
      };
      return <div class={classes}>{flattenChildren(slots.default?.())}</div>;
    };
  },
});
