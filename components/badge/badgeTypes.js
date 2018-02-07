import PropTypes from '../_util/vue-types'
export default () => ({
  count: PropTypes.number,
  dot: PropTypes.bool,
  offset: PropTypes.arrayOf([PropTypes.number, PropTypes.number]),
  overflowCount: PropTypes.number.def('99'),
  showZero: PropTypes.bool.def('false'),
  status: PropTypes.oneOf(['success', 'processing', 'default', 'error', 'warning']),
  text: PropTypes.string,
})
