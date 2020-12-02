// import PropTypes from '../_util/vue-types';
import { computed, provide } from 'vue';
import { propTypes } from '../vc-progress/src/types';
export const injectExtraPropsKey = Symbol();
const FunctionProvider = {
  inheritAttrs: false,
  isMenuProvider: true,
  props: {
    extraProps: propTypes.object,
  },
  setup(props, { slots }) {
    provide(
      injectExtraPropsKey,
      computed(() => props.extraProps),
    );
    return () => slots.default?.();
  },
};

export default FunctionProvider;
