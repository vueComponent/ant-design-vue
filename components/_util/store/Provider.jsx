import { provide } from 'vue';
import { storeShape } from './PropTypes';
import { getSlot } from '../props-util';
export default {
  name: 'StoreProvider',
  props: {
    store: storeShape.isRequired,
  },
  created() {
    provide('storeContext', this.$props);
  },
  render() {
    return getSlot(this);
  },
};
