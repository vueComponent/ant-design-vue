import PropTypes from '../_util/vue-types';
import { AbstractSelectProps } from '../select';

export const TreeData = PropTypes.shape({
  key: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.any,
  scopedSlots: PropTypes.object,
  children: PropTypes.array,
}).loose;

export const TreeSelectProps = () => ({
  ...AbstractSelectProps(),
  autofocus: PropTypes.bool,
  dropdownStyle: PropTypes.object,
  filterTreeNode: PropTypes.oneOfType([Function, Boolean]),
  getPopupContainer: PropTypes.func,
  labelInValue: PropTypes.bool,
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
  multiple: PropTypes.bool,
  notFoundContent: PropTypes.any,
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  showCheckedStrategy: PropTypes.oneOf(['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD']),
  suffixIcon: PropTypes.any,
  treeCheckable: PropTypes.oneOfType([PropTypes.any, PropTypes.bool]),
  treeCheckStrictly: PropTypes.bool,
  treeData: PropTypes.arrayOf(Object),
  treeDataSimpleMode: PropTypes.oneOfType([Boolean, Object]),

  dropdownClassName: PropTypes.string,
  dropdownMatchSelectWidth: PropTypes.bool,
  treeDefaultExpandAll: PropTypes.bool,
  treeExpandedKeys: PropTypes.array,
  treeIcon: PropTypes.bool,
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
