import { storeShape } from './PropTypes';
export default {
  name: 'StoreProvider',
  props: {
    store: storeShape.isRequired,
  },
  provide() {
    return {
      storeContext: this.$props,
    };
  },
  render() {
    return (this.$scopedSlots.default && this.$scopedSlots.default()) || [];
  },
};
