import { defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';

export default defineComponent({
  name: 'ColumnGroup',
  props: {
    title: PropTypes.any,
  },
  isTableColumnGroup: true,
  render() {
    return null;
  },
});
