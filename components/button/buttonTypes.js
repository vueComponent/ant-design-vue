import PropTypes from '../_util/vue-types';
export default () => ({
  prefixCls: PropTypes.string,
  type: PropTypes.string,
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']).def('button'),
  icon: PropTypes.string,
  shape: PropTypes.oneOf(['circle', 'circle-outline', 'round']),
  size: PropTypes.oneOf(['small', 'large', 'default']).def('default'),
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  disabled: PropTypes.bool,
  ghost: PropTypes.bool,
  block: PropTypes.bool,
});
