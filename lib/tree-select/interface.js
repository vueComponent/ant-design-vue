'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeSelectProps = exports.TreeData = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _select = require('../select');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TreeData = exports.TreeData = _vueTypes2['default'].shape({
  key: _vueTypes2['default'].string,
  value: _vueTypes2['default'].string,
  label: _vueTypes2['default'].any,
  scopedSlots: _vueTypes2['default'].object,
  children: _vueTypes2['default'].array
}).loose;

var TreeSelectProps = exports.TreeSelectProps = function TreeSelectProps() {
  return (0, _extends3['default'])({}, (0, _select.AbstractSelectProps)(), {
    value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object, _vueTypes2['default'].array]),
    defaultValue: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].array]),
    multiple: _vueTypes2['default'].bool,
    // onSelect: (value: any) => void,
    // onChange: (value: any, label: any) => void,
    // onSearch: (value: any) => void,
    searchPlaceholder: _vueTypes2['default'].string,
    dropdownClassName: _vueTypes2['default'].string,
    dropdownStyle: _vueTypes2['default'].object,
    dropdownMatchSelectWidth: _vueTypes2['default'].bool,
    treeDefaultExpandAll: _vueTypes2['default'].bool,
    treeCheckable: _vueTypes2['default'].bool,
    treeDefaultExpandedKeys: _vueTypes2['default'].arrayOf(String),
    filterTreeNode: _vueTypes2['default'].func,
    treeNodeFilterProp: _vueTypes2['default'].string,
    treeNodeLabelProp: _vueTypes2['default'].string,
    treeData: _vueTypes2['default'].arrayOf(Object),
    treeDataSimpleMode: _vueTypes2['default'].oneOfType([Boolean, Object]),
    loadData: _vueTypes2['default'].func,
    showCheckedStrategy: _vueTypes2['default'].oneOf(['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD']),
    labelInValue: _vueTypes2['default'].bool,
    treeCheckStrictly: _vueTypes2['default'].bool,
    getPopupContainer: _vueTypes2['default'].func
  });
};