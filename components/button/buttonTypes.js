import PropTypes, { withUndefined } from '../_util/vue-types';
export default () => ({
  prefixCls: PropTypes.string,
  type: PropTypes.string,
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']).def('button'),
  // icon: PropTypes.string,
  shape: PropTypes.oneOf(['circle', 'circle-outline', 'round']),
  size: PropTypes.oneOf(['small', 'large', 'default']).def('default'),
  loading: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
  disabled: PropTypes.looseBool,
  ghost: PropTypes.looseBool,
  block: PropTypes.looseBool,
  icon: PropTypes.any,
  onClick: PropTypes.func,
});
