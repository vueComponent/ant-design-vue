import PropTypes from '../_util/vue-types';
import { provide, reactive } from 'vue';

const FunctionProvider = {
  inheritAttrs: false,
  props: {
    injectExtraPropsKey: PropTypes.string,
  },
  setup(props, { slots, attrs }) {
    if (props.injectExtraPropsKey) {
      provide(props.injectExtraPropsKey, reactive(attrs));
    }
    return () => slots.default && slots.default();
  },
};

export default FunctionProvider;
