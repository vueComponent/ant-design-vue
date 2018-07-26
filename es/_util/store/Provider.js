
import { storeShape } from './PropTypes';
export default {
  name: 'StoreProvider',
  props: {
    store: storeShape.isRequired
  },
  provide: function provide() {
    return {
      _store: this.$props
    };
  },
  render: function render() {
    return this.$slots['default'][0];
  }
};