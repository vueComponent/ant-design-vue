import PropTypes from '../_util/vue-types';

export const switchPropTypes = {
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool.def(false),
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  // onChange: PropTypes.func,
  // onMouseUp: PropTypes.func,
  // onClick: PropTypes.func,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool.def(false),
  autofocus: PropTypes.bool.def(false),
  loadingIcon: PropTypes.any,
};
