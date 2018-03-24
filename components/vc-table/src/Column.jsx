import PropTypes from '../../_util/vue-types'

export default {
  name: 'Column',
  props: {
    colSpan: PropTypes.number,
    title: PropTypes.any,
    dataIndex: PropTypes.string,
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    fixed: PropTypes.oneOf([
      true,
      'left',
      'right',
    ]),
    render: PropTypes.func,
    // onCellClick: PropTypes.func,
    // onCell: PropTypes.func,
    // onHeaderCell: PropTypes.func,
  },
}
