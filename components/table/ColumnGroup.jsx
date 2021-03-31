import PropTypes from '../_util/vue-types';

export default {
  name: 'ATableColumnGroup',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['left', 'right'])]),
    title: PropTypes.any,
  },
  __ANT_TABLE_COLUMN_GROUP: true,
};
