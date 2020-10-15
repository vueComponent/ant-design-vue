import PropTypes from '../_util/vue-types';

export const switchPropTypes = {
  prefixCls: PropTypes.string,
  disabled: PropTypes.looseBool.def(false),
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  // onChange: PropTypes.func,
  // onMouseUp: PropTypes.func,
  // onClick: PropTypes.func,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  checked: PropTypes.looseBool,
  defaultChecked: PropTypes.looseBool.def(false),
  autofocus: PropTypes.looseBool.def(false),
  loadingIcon: PropTypes.any,
};
