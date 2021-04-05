import { defineComponent } from 'vue';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { tuple } from '../_util/type';

export default defineComponent({
  name: 'ATableColumnGroup',
  props: {
    fixed: withUndefined(
      PropTypes.oneOfType([PropTypes.looseBool, PropTypes.oneOf(tuple('left', 'right'))]),
    ),
    title: PropTypes.any,
  },
  __ANT_TABLE_COLUMN_GROUP: true,
  render() {
    return null;
  },
});
