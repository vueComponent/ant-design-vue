import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import { AbstractSelectProps } from '../select';

export var TreeData = PropTypes.shape({
  key: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.any,
  scopedSlots: PropTypes.object,
  children: PropTypes.array
}).loose;

export var TreeSelectProps = function TreeSelectProps() {
  return _extends({}, AbstractSelectProps(), {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    multiple: PropTypes.bool,
    // onSelect: (value: any) => void,
    // onChange: (value: any, label: any) => void,
    // onSearch: (value: any) => void,
    searchPlaceholder: PropTypes.string,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    dropdownMatchSelectWidth: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    treeCheckable: PropTypes.bool,
    treeDefaultExpandedKeys: PropTypes.arrayOf(String),
    filterTreeNode: PropTypes.func,
    treeNodeFilterProp: PropTypes.string,
    treeNodeLabelProp: PropTypes.string,
    treeData: PropTypes.arrayOf(Object),
    treeDataSimpleMode: PropTypes.oneOfType([Boolean, Object]),
    loadData: PropTypes.func,
    showCheckedStrategy: PropTypes.oneOf(['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD']),
    labelInValue: PropTypes.bool,
    treeCheckStrictly: PropTypes.bool,
    getPopupContainer: PropTypes.func
  });
};