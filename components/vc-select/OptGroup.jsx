import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
export default defineComponent({
  props: {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  },
  isSelectOptGroup: true,
  render() {
    return null;
  },
});
