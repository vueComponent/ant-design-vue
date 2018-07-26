import PropTypes from '../../_util/vue-types';

export default {
  name: 'Column',
  props: {
    colSpan: PropTypes.number,
    title: PropTypes.any,
    dataIndex: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fixed: PropTypes.oneOf([true, 'left', 'right']),
    customRender: PropTypes.func,
    className: PropTypes.string,
    // onCellClick: PropTypes.func,
    customCell: PropTypes.func,
    customHeaderCell: PropTypes.func
  }
};