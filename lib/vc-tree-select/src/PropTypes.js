'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectPropTypes = undefined;

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _strategies = require('./strategies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function nonEmptyStringType(props, propsName) {
  var value = props[propsName];
  if (typeof value !== 'string' || !value) {
    return new Error(); // Just a flag, so don't need message.
  }
}

function valueType(props, propName, componentName) {
  var labelInValueShape = _vueTypes2['default'].shape({
    value: nonEmptyStringType,
    label: _vueTypes2['default'].node
  });
  if (props.labelInValue) {
    var validate = _vueTypes2['default'].oneOfType([_vueTypes2['default'].arrayOf(labelInValueShape), labelInValueShape]);
    var error = validate.apply(undefined, arguments);
    if (error) {
      return new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`, ' + ('when `labelInValue` is `true`, `' + propName + '` should in ') + 'shape of `{ value: string, label?: string }`.');
    }
  } else if (props.treeCheckable && props.treeCheckStrictly) {
    var _validate = _vueTypes2['default'].oneOfType([_vueTypes2['default'].arrayOf(labelInValueShape), labelInValueShape]);
    var _error = _validate.apply(undefined, arguments);
    if (_error) {
      return new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`, ' + 'when `treeCheckable` and `treeCheckStrictly` are `true`, ' + ('`' + propName + '` should in shape of `{ value: string, label?: string }`.'));
    }
  } else if (props.multiple && props[propName] === '') {
    return new Error('Invalid prop `' + propName + '` of type `string` supplied to `' + componentName + '`, ' + 'expected `array` when `multiple` is `true`.');
  } else {
    var _validate2 = _vueTypes2['default'].oneOfType([_vueTypes2['default'].arrayOf(_vueTypes2['default'].string), _vueTypes2['default'].string]);
    return _validate2.apply(undefined, arguments);
  }
}

var SelectPropTypes = exports.SelectPropTypes = {
  // className: PropTypes.string,
  prefixCls: _vueTypes2['default'].string,
  multiple: _vueTypes2['default'].bool,
  filterTreeNode: _vueTypes2['default'].any,
  showSearch: _vueTypes2['default'].bool,
  disabled: _vueTypes2['default'].bool,
  showArrow: _vueTypes2['default'].bool,
  allowClear: _vueTypes2['default'].bool,
  defaultOpen: _vueTypes2['default'].bool,
  open: _vueTypes2['default'].bool,
  transitionName: _vueTypes2['default'].string,
  animation: _vueTypes2['default'].string,
  choiceTransitionName: _vueTypes2['default'].string,
  // onClick: PropTypes.func,
  // onChange: PropTypes.func,
  // onSelect: PropTypes.func,
  // onDeselect: PropTypes.func,
  // onSearch: PropTypes.func,
  searchPlaceholder: _vueTypes2['default'].string,
  placeholder: _vueTypes2['default'].any,
  inputValue: _vueTypes2['default'].any,
  value: _vueTypes2['default'].any,
  defaultValue: _vueTypes2['default'].any,
  label: _vueTypes2['default'].any, // vnode
  defaultLabel: _vueTypes2['default'].any,
  labelInValue: _vueTypes2['default'].bool,
  dropdownClassName: _vueTypes2['default'].string,
  dropdownStyle: _vueTypes2['default'].object,
  dropdownPopupAlign: _vueTypes2['default'].object,
  dropdownVisibleChange: _vueTypes2['default'].func,
  maxTagTextLength: _vueTypes2['default'].number,
  showCheckedStrategy: _vueTypes2['default'].oneOf([_strategies.SHOW_ALL, _strategies.SHOW_PARENT, _strategies.SHOW_CHILD]),
  treeCheckStrictly: _vueTypes2['default'].bool,
  treeIcon: _vueTypes2['default'].bool,
  treeLine: _vueTypes2['default'].bool,
  treeDefaultExpandAll: _vueTypes2['default'].bool,
  treeCheckable: _vueTypes2['default'].any, // bool vnode
  treeNodeLabelProp: _vueTypes2['default'].string,
  treeNodeFilterProp: _vueTypes2['default'].string,
  treeData: _vueTypes2['default'].array,
  treeDataSimpleMode: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]),
  loadData: _vueTypes2['default'].func,
  dropdownMatchSelectWidth: _vueTypes2['default'].bool,
  notFoundContent: _vueTypes2['default'].any,
  children: _vueTypes2['default'].any,
  autoFocus: _vueTypes2['default'].bool
};