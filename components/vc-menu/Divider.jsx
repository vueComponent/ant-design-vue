import { inject } from 'vue';
import { injectExtraPropsKey } from './FunctionProvider';
export default {
  name: 'MenuDivider',
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
    rootPrefixCls: String,
  },
  setup() {
    return {
      injectExtraProps: inject(injectExtraPropsKey, () => ({})),
    };
  },
  render() {
    const { rootPrefixCls } = { ...this.$props, ...this.injectExtraProps };
    const { class: className = '', style } = this.$attrs;
    return <li class={[className, `${rootPrefixCls}-item-divider`]} style={style} />;
  },
};
