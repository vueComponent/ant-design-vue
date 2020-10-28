// import PropTypes from '../_util/vue-types';
import { provide, reactive } from 'vue';
export const injectExtraPropsKey = Symbol();
const FunctionProvider = {
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    provide(injectExtraPropsKey, reactive(attrs));
    return () => slots.default?.();
  },
};

export default FunctionProvider;
