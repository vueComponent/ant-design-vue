import PropTypes from '../_util/vue-types';
export default () => ({
  prefixCls: PropTypes.string.def('ant-btn'),
  type: PropTypes.oneOf(['primary', 'danger', 'dashed', 'ghost', 'default']).def('default'),
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']).def('button'),
  icon: PropTypes.string,
  shape: PropTypes.oneOf(['circle', 'circle-outline']),
  size: PropTypes.oneOf(['small', 'large', 'default']).def('default'),
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  disabled: PropTypes.bool,
  ghost: PropTypes.bool,
  block: PropTypes.bool,
});
