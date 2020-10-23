import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';

export default defineComponent({
  name: 'ATableColumnGroup',
  props: {
    title: PropTypes.any,
  },
  __ANT_TABLE_COLUMN_GROUP: true,
  render() {
    return null;
  },
});
