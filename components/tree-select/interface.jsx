import PropTypes, { withUndefined } from '../_util/vue-types';
import { SelectProps } from '../select';

export const TreeData = PropTypes.shape({
  key: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.any,
  scopedSlots: PropTypes.object,
  children: PropTypes.array,
}).loose;

export const TreeSelectProps = () => ({
  ...SelectProps(),
  autofocus: PropTypes.looseBool,
  dropdownStyle: PropTypes.object,
  filterTreeNode: withUndefined(PropTypes.oneOfType([Function, Boolean])),
  getPopupContainer: PropTypes.func,
  labelInValue: PropTypes.looseBool,
  loadData: PropTypes.func,
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.any,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),
  multiple: PropTypes.looseBool,
  notFoundContent: PropTypes.any,
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  showCheckedStrategy: PropTypes.oneOf(['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD']),
  suffixIcon: PropTypes.any,
  treeCheckable: PropTypes.any,
  treeCheckStrictly: PropTypes.looseBool,
  treeData: PropTypes.arrayOf(Object),
  treeDataSimpleMode: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, Object])),

  dropdownClassName: PropTypes.string,
  dropdownMatchSelectWidth: PropTypes.looseBool,
  treeDefaultExpandAll: PropTypes.looseBool,
  treeExpandedKeys: PropTypes.array,
  treeIcon: PropTypes.looseBool,
  treeDefaultExpandedKeys: PropTypes.array,
  treeNodeFilterProp: PropTypes.string,
  treeNodeLabelProp: PropTypes.string,
  replaceFields: PropTypes.object.def({}),
  clearIcon: PropTypes.any,
  removeIcon: PropTypes.any,

  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onTreeExpand: PropTypes.func,
  'onUpdate:treeExpandedKeys': PropTypes.func,
  'onUpdate:searchValue': PropTypes.func,
  'onUpdate:value': PropTypes.func,
});
