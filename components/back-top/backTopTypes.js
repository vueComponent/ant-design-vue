import PropTypes from '../_util/vue-types';
export default () => ({
  visibilityHeight: PropTypes.number,
  // onClick?: React.MouseEventHandler<any>;
  target: PropTypes.func,
  prefixCls: PropTypes.string,
  onClick: PropTypes.func,
  // visible: PropTypes.bool, // Only for test. Don't use it.
});
