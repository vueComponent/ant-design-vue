/**
 * ARIA: https://www.w3.org/TR/wai-aria/#combobox
 * Sample 1: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html
 * Sample 2: https://www.w3.org/blog/wai-components-gallery/widget/combobox-with-aria-autocompleteinline/
 *
 * Tab logic:
 * Popup is close
 * 1. Focus input (mark component as focused)
 * 2. Press enter to show the popup
 * 3. If popup has input, focus it
 *
 * Popup is open
 * 1. press tab to close the popup
 * 2. Focus back to the selection input box
 * 3. Let the native tab going on
 *
 * TreeSelect use 2 design type.
 * In single mode, we should focus on the `span`
 * In multiple mode, we should focus on the `input`
 */

import shallowEqual from 'shallowequal';
import raf from 'raf';
import warning from 'warning';
import PropTypes from '../../_util/vue-types';
import KeyCode from '../../_util/KeyCode';

import SelectTrigger from './SelectTrigger';
import SingleSelector from './Selector/SingleSelector';
import MultipleSelector from './Selector/MultipleSelector';
import SinglePopup from './Popup/SinglePopup';
import MultiplePopup from './Popup/MultiplePopup';

import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './strategies';
import BaseMixin from '../../_util/BaseMixin';
import {
  createRef,
  generateAriaId,
  formatInternalValue,
  formatSelectorValue,
  parseSimpleTreeData,
  convertDataToTree,
  convertTreeToEntities,
  conductCheck,
  getHalfCheckedKeys,
  flatToHierarchy,
  isPosRelated,
  isLabelInValue,
  getFilterTree,
  cleanEntity,
} from './util';
import SelectNode from './SelectNode';
import {
  initDefaultProps,
  getOptionProps,
  mergeProps,
  getPropsData,
  filterEmpty,
  getListeners,
} from '../../_util/props-util';
function getWatch(keys = []) {
  const watch = {};
  keys.forEach(k => {
    watch[k] = function() {
      this.needSyncKeys[k] = true;
    };
  });
  return watch;
}
const Select = {
  name: 'Select',
  mixins: [BaseMixin],
  props: initDefaultProps(
    {
      prefixCls: PropTypes.string,
      prefixAria: PropTypes.string,
      multiple: PropTypes.bool,
      showArrow: PropTypes.bool,
      open: PropTypes.bool,
      value: PropTypes.any,

      autoFocus: PropTypes.bool,

      defaultOpen: PropTypes.bool,
      defaultValue: PropTypes.any,

      showSearch: PropTypes.bool,
      placeholder: PropTypes.any,
      inputValue: PropTypes.string, // [Legacy] Deprecated. Use `searchValue` instead.
      searchValue: PropTypes.string,
      autoClearSearchValue: PropTypes.bool,
      searchPlaceholder: PropTypes.any, // [Legacy] Confuse with placeholder
      disabled: PropTypes.bool,
      children: PropTypes.any,
      labelInValue: PropTypes.bool,
      maxTagCount: PropTypes.number,
      maxTagPlaceholder: PropTypes.oneOfType([PropTypes.any, PropTypes.func]),
      maxTagTextLength: PropTypes.number,
      showCheckedStrategy: PropTypes.oneOf([SHOW_ALL, SHOW_PARENT, SHOW_CHILD]),
      dropdownClassName: PropTypes.string,
      dropdownStyle: PropTypes.object,
      dropdownVisibleChange: PropTypes.func,
      dropdownMatchSelectWidth: PropTypes.bool,
      treeData: PropTypes.array,
      treeDataSimpleMode: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      treeNodeFilterProp: PropTypes.string,
      treeNodeLabelProp: PropTypes.string,
      treeCheckable: PropTypes.oneOfType([PropTypes.any, PropTypes.object, PropTypes.bool]),
      // treeCheckable: PropTypes.any,
      treeCheckStrictly: PropTypes.bool,
      treeIcon: PropTypes.bool,
      treeLine: PropTypes.bool,
      treeDefaultExpandAll: PropTypes.bool,
      treeDefaultExpandedKeys: PropTypes.array,
      treeExpandedKeys: PropTypes.array,
      loadData: PropTypes.func,
      filterTreeNode: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

      notFoundContent: PropTypes.any,
      getPopupContainer: PropTypes.func,

      // onSearch: PropTypes.func,
      // onSelect: PropTypes.func,
      // onDeselect: PropTypes.func,
      // onChange: PropTypes.func,
      // onDropdownVisibleChange: PropTypes.func,

      // onTreeExpand: PropTypes.func,
      allowClear: PropTypes.bool,
      transitionName: PropTypes.string,
      animation: PropTypes.string,
      choiceTransitionName: PropTypes.string,
      inputIcon: PropTypes.any,
      clearIcon: PropTypes.any,
      removeIcon: PropTypes.any,
      switcherIcon: PropTypes.any,
      __propsSymbol__: PropTypes.any,
    },
    {
      prefixCls: 'rc-tree-select',
      prefixAria: 'rc-tree-select',
      showArrow: true,
      showSearch: true,
      autoClearSearchValue: true,
      showCheckedStrategy: SHOW_CHILD,

      // dropdownMatchSelectWidth change the origin design, set to false now
      // ref: https://github.com/react-component/select/blob/4cad95e098a341a09de239ad6981067188842020/src/Select.jsx#L344
      // ref: https://github.com/react-component/select/pull/71
      treeNodeFilterProp: 'value',
      treeNodeLabelProp: 'title',
      treeIcon: false,
      notFoundContent: 'Not Found',
      dropdownStyle: {},
      dropdownVisibleChange: () => {
        return true;
      },
    },
  ),

  data() {
    warning(this.$props.__propsSymbol__, 'must pass __propsSymbol__');
    const { prefixAria, defaultOpen, open } = this.$props;
    this.needSyncKeys = {};
    this.selectorRef = createRef();
    this.selectTriggerRef = createRef();

    // ARIA need `aria-controls` props mapping
    // Since this need user input. Let's generate ourselves
    this.ariaId = generateAriaId(`${prefixAria}-list`);

    const state = {
      _open: open || defaultOpen,
      _valueList: [],
      _searchHalfCheckedKeys: [],
      _missValueList: [], // Contains the value not in the tree
      _selectorValueList: [], // Used for multiple selector
      _valueEntities: {},
      _posEntities: new Map(),
      _keyEntities: new Map(),
      _searchValue: '',
      _prevProps: {},
      _init: true,
      _focused: undefined,
      _treeNodes: undefined,
      _filteredTreeNodes: undefined,
    };
    const newState = this.getDerivedStateFromProps(this.$props, state);
    return {
      ...state,
      ...newState,
    };
  },

  provide() {
    return {
      vcTreeSelect: {
        onSelectorFocus: this.onSelectorFocus,
        onSelectorBlur: this.onSelectorBlur,
        onSelectorKeyDown: this.onComponentKeyDown,
        onSelectorClear: this.onSelectorClear,
        onMultipleSelectorRemove: this.onMultipleSelectorRemove,

        onTreeNodeSelect: this.onTreeNodeSelect,
        onTreeNodeCheck: this.onTreeNodeCheck,
        onPopupKeyDown: this.onComponentKeyDown,

        onSearchInputChange: this.onSearchInputChange,
        onSearchInputKeyDown: this.onSearchInputKeyDown,
      },
    };
  },
  watch: {
    ...getWatch(['treeData', 'defaultValue', 'value']),
    __propsSymbol__() {
      const state = this.getDerivedStateFromProps(this.$props, this.$data);
      this.setState(state);
      this.needSyncKeys = {};
    },
    '$data._valueList': function() {
      this.$nextTick(() => {
        this.forcePopupAlign();
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      const { autoFocus, disabled } = this.$props;
      if (autoFocus && !disabled) {
        this.focus();
      }
    });
  },

  methods: {
    getDerivedStateFromProps(nextProps, prevState) {
      const h = this.$createElement;
      const { _prevProps: prevProps = {} } = prevState;
      const {
        treeCheckable,
        treeCheckStrictly,
        filterTreeNode,
        treeNodeFilterProp,
        treeDataSimpleMode,
      } = nextProps;
      const newState = {
        _prevProps: { ...nextProps },
        _init: false,
      };
      const self = this;
      // Process the state when props updated
      function processState(propName, updater) {
        if (prevProps[propName] !== nextProps[propName] || self.needSyncKeys[propName]) {
          updater(nextProps[propName], prevProps[propName]);
          return true;
        }
        return false;
      }

      let valueRefresh = false;

      // Open
      processState('open', propValue => {
        newState._open = propValue;
      });

      // Tree Nodes
      let treeNodes;
      let treeDataChanged = false;
      let treeDataModeChanged = false;
      processState('treeData', propValue => {
        treeNodes = convertDataToTree(h, propValue);
        treeDataChanged = true;
      });

      processState('treeDataSimpleMode', (propValue, prevValue) => {
        if (!propValue) return;

        const prev = !prevValue || prevValue === true ? {} : prevValue;

        // Shallow equal to avoid dynamic prop object
        if (!shallowEqual(propValue, prev)) {
          treeDataModeChanged = true;
        }
      });

      // Parse by `treeDataSimpleMode`
      if (treeDataSimpleMode && (treeDataChanged || treeDataModeChanged)) {
        const simpleMapper = {
          id: 'id',
          pId: 'pId',
          rootPId: null,
          ...(treeDataSimpleMode !== true ? treeDataSimpleMode : {}),
        };
        treeNodes = convertDataToTree(h, parseSimpleTreeData(nextProps.treeData, simpleMapper));
      }

      // If `treeData` not provide, use children TreeNodes
      if (!nextProps.treeData) {
        // processState('children', (propValue) => {
        //   treeNodes = Array.isArray(propValue) ? propValue : [propValue]
        // })
        treeNodes = filterEmpty(this.$slots.default);
      }

      // Convert `treeData` to entities
      if (treeNodes) {
        const entitiesMap = convertTreeToEntities(treeNodes);
        newState._treeNodes = treeNodes;
        newState._posEntities = entitiesMap.posEntities;
        newState._valueEntities = entitiesMap.valueEntities;
        newState._keyEntities = entitiesMap.keyEntities;

        valueRefresh = true;
      }

      // Value List
      if (prevState._init) {
        processState('defaultValue', propValue => {
          newState._valueList = formatInternalValue(propValue, nextProps);
          valueRefresh = true;
        });
      }

      processState('value', propValue => {
        newState._valueList = formatInternalValue(propValue, nextProps);
        valueRefresh = true;
      });

      // Selector Value List
      if (valueRefresh) {
        // Find out that value not exist in the tree
        const missValueList = [];
        const filteredValueList = [];
        const keyList = [];

        // Get latest value list
        let latestValueList = newState._valueList;
        if (!latestValueList) {
          // Also need add prev missValueList to avoid new treeNodes contains the value
          latestValueList = [...prevState._valueList, ...prevState._missValueList];
        }

        // Get key by value
        latestValueList.forEach(wrapperValue => {
          const { value } = wrapperValue;
          const entity = (newState._valueEntities || prevState._valueEntities)[value];

          if (entity) {
            keyList.push(entity.key);
            filteredValueList.push(wrapperValue);
            return;
          }

          // If not match, it may caused by ajax load. We need keep this
          missValueList.push(wrapperValue);
        });

        // We need calculate the value when tree is checked tree
        if (treeCheckable && !treeCheckStrictly) {
          // Calculate the keys need to be checked
          const { checkedKeys } = conductCheck(
            keyList,
            true,
            newState._keyEntities || prevState._keyEntities,
          );

          // Format value list again for internal usage
          newState._valueList = checkedKeys.map(key => ({
            value: (newState._keyEntities || prevState._keyEntities).get(key).value,
          }));
        } else {
          newState._valueList = filteredValueList;
        }

        // Fill the missValueList, we still need display in the selector
        newState._missValueList = missValueList;

        // Calculate the value list for `Selector` usage
        newState._selectorValueList = formatSelectorValue(
          newState._valueList,
          nextProps,
          newState._valueEntities || prevState._valueEntities,
        );
      }

      // [Legacy] To align with `Select` component,
      // We use `searchValue` instead of `inputValue` but still keep the api
      // `inputValue` support `null` to work as `autoClearSearchValue`
      processState('inputValue', propValue => {
        if (propValue !== null) {
          newState._searchValue = propValue;
        }
      });

      // Search value
      processState('searchValue', propValue => {
        newState._searchValue = propValue;
      });

      // Do the search logic
      if (newState._searchValue !== undefined || (prevState._searchValue && treeNodes)) {
        const searchValue =
          newState._searchValue !== undefined ? newState._searchValue : prevState._searchValue;
        const upperSearchValue = String(searchValue).toUpperCase();

        let filterTreeNodeFn = filterTreeNode;
        if (filterTreeNode === false) {
          // Don't filter if is false
          filterTreeNodeFn = () => true;
        } else if (typeof filterTreeNodeFn !== 'function') {
          // When is not function (true or undefined), use inner filter
          filterTreeNodeFn = (_, node) => {
            const nodeValue = String(getPropsData(node)[treeNodeFilterProp]).toUpperCase();
            return nodeValue.indexOf(upperSearchValue) !== -1;
          };
        }

        newState._filteredTreeNodes = getFilterTree(
          this.$createElement,
          newState._treeNodes || prevState._treeNodes,
          searchValue,
          filterTreeNodeFn,
          newState._valueEntities || prevState._valueEntities,
        );
      }

      // We should re-calculate the halfCheckedKeys when in search mode
      if (
        valueRefresh &&
        treeCheckable &&
        !treeCheckStrictly &&
        (newState._searchValue || prevState._searchValue)
      ) {
        newState._searchHalfCheckedKeys = getHalfCheckedKeys(
          newState._valueList,
          newState._valueEntities || prevState._valueEntities,
        );
      }

      // Checked Strategy
      processState('showCheckedStrategy', () => {
        newState._selectorValueList =
          newState._selectorValueList ||
          formatSelectorValue(
            newState._valueList || prevState._valueList,
            nextProps,
            newState._valueEntities || prevState._valueEntities,
          );
      });

      return newState;
    },
    // ==================== Selector ====================
    onSelectorFocus() {
      this.setState({ _focused: true });
    },

    onSelectorBlur() {
      this.setState({ _focused: false });

      // TODO: Close when Popup is also not focused
      // this.setState({ open: false });
    },

    // Handle key board event in both Selector and Popup
    onComponentKeyDown(event) {
      const { _open: open } = this.$data;
      const { keyCode } = event;

      if (!open) {
        if ([KeyCode.ENTER, KeyCode.DOWN].indexOf(keyCode) !== -1) {
          this.setOpenState(true);
        }
      } else if (KeyCode.ESC === keyCode) {
        this.setOpenState(false);
      } else if ([KeyCode.UP, KeyCode.DOWN, KeyCode.LEFT, KeyCode.RIGHT].indexOf(keyCode) !== -1) {
        // TODO: Handle `open` state
        event.stopPropagation();
      }
    },

    onDeselect(wrappedValue, node, nodeEventInfo) {
      this.__emit('deselect', wrappedValue, node, nodeEventInfo);
    },

    onSelectorClear(event) {
      const { disabled } = this.$props;
      if (disabled) return;

      this.triggerChange([], []);

      if (!this.isSearchValueControlled()) {
        this.setUncontrolledState({
          _searchValue: '',
          _filteredTreeNodes: null,
        });
      }

      event.stopPropagation();
    },

    onMultipleSelectorRemove(event, removeValue) {
      event.stopPropagation();

      const {
        _valueList: valueList,
        _missValueList: missValueList,
        _valueEntities: valueEntities,
      } = this.$data;

      const { treeCheckable, treeCheckStrictly, treeNodeLabelProp, disabled } = this.$props;
      if (disabled) return;

      // Find trigger entity
      const triggerEntity = valueEntities[removeValue];

      // Clean up value
      let newValueList = valueList;
      if (triggerEntity) {
        // If value is in tree
        if (treeCheckable && !treeCheckStrictly) {
          newValueList = valueList.filter(({ value }) => {
            const entity = valueEntities[value];
            return !isPosRelated(entity.pos, triggerEntity.pos);
          });
        } else {
          newValueList = valueList.filter(({ value }) => value !== removeValue);
        }
      }

      const triggerNode = triggerEntity ? triggerEntity.node : null;

      const extraInfo = {
        triggerValue: removeValue,
        triggerNode,
      };
      const deselectInfo = {
        node: triggerNode,
      };

      // [Legacy] Little hack on this to make same action as `onCheck` event.
      if (treeCheckable) {
        const filteredEntityList = newValueList.map(({ value }) => valueEntities[value]);

        deselectInfo.event = 'check';
        deselectInfo.checked = false;
        deselectInfo.checkedNodes = filteredEntityList.map(({ node }) => node);
        deselectInfo.checkedNodesPositions = filteredEntityList.map(({ node, pos }) => ({
          node,
          pos,
        }));

        if (treeCheckStrictly) {
          extraInfo.allCheckedNodes = deselectInfo.checkedNodes;
        } else {
          // TODO: It's too expansive to get `halfCheckedKeys` in onDeselect. Not pass this.
          extraInfo.allCheckedNodes = flatToHierarchy(filteredEntityList).map(({ node }) => node);
        }
      } else {
        deselectInfo.event = 'select';
        deselectInfo.selected = false;
        deselectInfo.selectedNodes = newValueList.map(
          ({ value }) => (valueEntities[value] || {}).node,
        );
      }

      // Some value user pass prop is not in the tree, we also need clean it
      const newMissValueList = missValueList.filter(({ value }) => value !== removeValue);
      let wrappedValue;
      if (this.isLabelInValue()) {
        wrappedValue = {
          label: triggerNode ? getPropsData(triggerNode)[treeNodeLabelProp] : null,
          value: removeValue,
        };
      } else {
        wrappedValue = removeValue;
      }

      this.onDeselect(wrappedValue, triggerNode, deselectInfo);

      this.triggerChange(newMissValueList, newValueList, extraInfo);
    },

    // ===================== Popup ======================
    onValueTrigger(isAdd, nodeList, nodeEventInfo, nodeExtraInfo) {
      const { node } = nodeEventInfo;
      const { value } = node.$props;
      const {
        _missValueList: missValueList,
        _valueEntities: valueEntities,
        _keyEntities: keyEntities,
        _searchValue: searchValue,
      } = this.$data;
      const {
        disabled,
        inputValue,
        treeNodeLabelProp,
        multiple,
        treeCheckable,
        treeCheckStrictly,
        autoClearSearchValue,
      } = this.$props;
      const label = node.$props[treeNodeLabelProp];

      if (disabled) return;

      // Wrap the return value for user
      let wrappedValue;
      if (this.isLabelInValue()) {
        wrappedValue = {
          value,
          label,
        };
      } else {
        wrappedValue = value;
      }

      // [Legacy] Origin code not trigger `onDeselect` every time. Let's align the behaviour.
      if (isAdd) {
        this.__emit('select', wrappedValue, node, nodeEventInfo);
      } else {
        this.__emit('deselect', wrappedValue, node, nodeEventInfo);
      }

      // Get wrapped value list.
      // This is a bit hack cause we use key to match the value.
      let newValueList = nodeList.map(node => {
        const props = getPropsData(node);
        return {
          value: props.value,
          label: props[treeNodeLabelProp],
        };
      });

      // When is `treeCheckable` and with `searchValue`, `valueList` is not full filled.
      // We need calculate the missing nodes.
      if (treeCheckable && !treeCheckStrictly) {
        let keyList = newValueList.map(({ value: val }) => valueEntities[val].key);
        if (isAdd) {
          keyList = conductCheck(keyList, true, keyEntities).checkedKeys;
        } else {
          keyList = conductCheck([valueEntities[value].key], false, keyEntities, {
            checkedKeys: keyList,
          }).checkedKeys;
        }
        newValueList = keyList.map(key => {
          const props = getPropsData(keyEntities.get(key).node);
          return {
            value: props.value,
            label: props[treeNodeLabelProp],
          };
        });
      }

      // Clean up `searchValue` when this prop is set
      if (autoClearSearchValue || inputValue === null) {
        // Clean state `searchValue` if uncontrolled
        if (!this.isSearchValueControlled() && (multiple || treeCheckable)) {
          this.setUncontrolledState({
            _searchValue: '',
            _filteredTreeNodes: null,
          });
        }

        // Trigger onSearch if `searchValue` to be empty.
        // We should also trigger onSearch with empty string here
        // since if user use `treeExpandedKeys`, it need user have the ability to reset it.
        if (searchValue && searchValue.length) {
          this.__emit('update:searchValue', '');
          this.__emit('search', '');
        }
      }

      // [Legacy] Provide extra info
      const extraInfo = {
        ...nodeExtraInfo,
        triggerValue: value,
        triggerNode: node,
      };

      this.triggerChange(missValueList, newValueList, extraInfo);
    },

    onTreeNodeSelect(_, nodeEventInfo) {
      const { _valueList: valueList, _valueEntities: valueEntities } = this.$data;
      const { treeCheckable, multiple } = this.$props;
      if (treeCheckable) return;

      if (!multiple) {
        this.setOpenState(false);
      }

      const isAdd = nodeEventInfo.selected;
      const {
        $props: { value: selectedValue },
      } = nodeEventInfo.node;

      let newValueList;

      if (!multiple) {
        newValueList = [{ value: selectedValue }];
      } else {
        newValueList = valueList.filter(({ value }) => value !== selectedValue);
        if (isAdd) {
          newValueList.push({ value: selectedValue });
        }
      }

      const selectedNodes = newValueList
        .map(({ value }) => valueEntities[value])
        .filter(entity => entity)
        .map(({ node }) => node);

      this.onValueTrigger(isAdd, selectedNodes, nodeEventInfo, { selected: isAdd });
    },

    onTreeNodeCheck(_, nodeEventInfo) {
      const {
        _searchValue: searchValue,
        _keyEntities: keyEntities,
        _valueEntities: valueEntities,
        _valueList: valueList,
      } = this.$data;
      const { treeCheckStrictly } = this.$props;

      const { checkedNodes, checkedNodesPositions } = nodeEventInfo;
      const isAdd = nodeEventInfo.checked;

      const extraInfo = {
        checked: isAdd,
      };

      let checkedNodeList = checkedNodes;

      // [Legacy] Check event provide `allCheckedNodes`.
      // When `treeCheckStrictly` or internal `searchValue` is set, TreeNode will be unrelated:
      // - Related: Show the top checked nodes and has children prop.
      // - Unrelated: Show all the checked nodes.
      if (searchValue) {
        const oriKeyList = valueList
          .map(({ value }) => valueEntities[value])
          .filter(entity => entity)
          .map(({ key }) => key);

        let keyList;
        if (isAdd) {
          keyList = Array.from(
            new Set([
              ...oriKeyList,
              ...checkedNodeList.map(node => {
                const { value } = getPropsData(node);
                return valueEntities[value].key;
              }),
            ]),
          );
        } else {
          keyList = conductCheck([getPropsData(nodeEventInfo.node).eventKey], false, keyEntities, {
            checkedKeys: oriKeyList,
          }).checkedKeys;
        }

        checkedNodeList = keyList.map(key => keyEntities.get(key).node);

        // Let's follow as not `treeCheckStrictly` format
        extraInfo.allCheckedNodes = keyList.map(key => cleanEntity(keyEntities.get(key)));
      } else if (treeCheckStrictly) {
        extraInfo.allCheckedNodes = nodeEventInfo.checkedNodes;
      } else {
        extraInfo.allCheckedNodes = flatToHierarchy(checkedNodesPositions);
      }

      this.onValueTrigger(isAdd, checkedNodeList, nodeEventInfo, extraInfo);
    },

    // ==================== Trigger =====================

    onDropdownVisibleChange(open) {
      const { multiple, treeCheckable } = this.$props;
      const { _searchValue } = this;

      // When set open success and single mode,
      // we will reset the input content.
      if (open && !multiple && !treeCheckable && _searchValue) {
        this.setUncontrolledState({
          _searchValue: '',
          _filteredTreeNodes: null,
        });
      }
      this.setOpenState(open, true);
    },

    onSearchInputChange(event) {
      const value = event.target.value;
      const { _treeNodes: treeNodes, _valueEntities: valueEntities } = this.$data;
      const { filterTreeNode, treeNodeFilterProp } = this.$props;
      this.__emit('update:searchValue', value);
      this.__emit('search', value);

      let isSet = false;

      if (!this.isSearchValueControlled()) {
        isSet = this.setUncontrolledState({
          _searchValue: value,
        });
        this.setOpenState(true);
      }

      if (isSet) {
        // Do the search logic
        const upperSearchValue = String(value).toUpperCase();

        let filterTreeNodeFn = filterTreeNode;
        if (filterTreeNode === false) {
          filterTreeNodeFn = () => true;
        } else if (!filterTreeNodeFn) {
          filterTreeNodeFn = (_, node) => {
            const nodeValue = String(getPropsData(node)[treeNodeFilterProp]).toUpperCase();
            return nodeValue.indexOf(upperSearchValue) !== -1;
          };
        }

        this.setState({
          _filteredTreeNodes: getFilterTree(
            this.$createElement,
            treeNodes,
            value,
            filterTreeNodeFn,
            valueEntities,
          ),
        });
      }
    },

    onSearchInputKeyDown(event) {
      const { _searchValue: searchValue, _valueList: valueList } = this.$data;

      const { keyCode } = event;

      if (KeyCode.BACKSPACE === keyCode && this.isMultiple() && !searchValue && valueList.length) {
        const lastValue = valueList[valueList.length - 1].value;
        this.onMultipleSelectorRemove(event, lastValue);
      }
    },

    onChoiceAnimationLeave() {
      this.forcePopupAlign();
    },

    /**
     * Only update the value which is not in props
     */
    setUncontrolledState(state) {
      let needSync = false;
      const newState = {};
      const props = getOptionProps(this);
      Object.keys(state).forEach(name => {
        if (name.slice(1) in props) return;

        needSync = true;
        newState[name] = state[name];
      });

      if (needSync) {
        this.setState(newState);
      }

      return needSync;
    },

    // [Legacy] Origin provide `documentClickClose` which triggered by `Trigger`
    // Currently `TreeSelect` align the hide popup logic as `Select` which blur to hide.
    // `documentClickClose` is not accurate anymore. Let's just keep the key word.
    setOpenState(open, byTrigger = false) {
      const { dropdownVisibleChange } = this.$props;

      if (
        dropdownVisibleChange &&
        dropdownVisibleChange(open, { documentClickClose: !open && byTrigger }) === false
      ) {
        return;
      }

      this.setUncontrolledState({ _open: open });
    },

    // Tree checkable is also a multiple case
    isMultiple() {
      const { multiple, treeCheckable } = this.$props;
      return !!(multiple || treeCheckable);
    },

    isLabelInValue() {
      return isLabelInValue(this.$props);
    },

    // [Legacy] To align with `Select` component,
    // We use `searchValue` instead of `inputValue`
    // but currently still need support that.
    // Add this method the check if is controlled
    isSearchValueControlled() {
      const props = getOptionProps(this);
      const { inputValue } = props;
      if ('searchValue' in props) return true;
      return 'inputValue' in props && inputValue !== null;
    },

    forcePopupAlign() {
      const $trigger = this.selectTriggerRef.current;
      if ($trigger) {
        $trigger.forcePopupAlign();
      }
    },

    delayForcePopupAlign() {
      // Wait 2 frame to avoid dom update & dom algin in the same time
      // https://github.com/ant-design/ant-design/issues/12031
      raf(() => {
        raf(this.forcePopupAlign);
      });
    },

    /**
     * 1. Update state valueList.
     * 2. Fire `onChange` event to user.
     */
    triggerChange(missValueList, valueList, extraInfo = {}) {
      const {
        _valueEntities: valueEntities,
        _searchValue: searchValue,
        _selectorValueList: prevSelectorValueList,
      } = this.$data;
      const props = getOptionProps(this);
      const { disabled, treeCheckable, treeCheckStrictly } = props;
      if (disabled) return;

      // Trigger
      const extra = {
        // [Legacy] Always return as array contains label & value
        preValue: prevSelectorValueList.map(({ label, value }) => ({ label, value })),
        ...extraInfo,
      };

      // Format value by `treeCheckStrictly`
      const selectorValueList = formatSelectorValue(valueList, props, valueEntities);

      if (!('value' in props)) {
        const newState = {
          _missValueList: missValueList,
          _valueList: valueList,
          _selectorValueList: selectorValueList,
        };

        if (searchValue && treeCheckable && !treeCheckStrictly) {
          newState._searchHalfCheckedKeys = getHalfCheckedKeys(valueList, valueEntities);
        }

        this.setState(newState);
      }

      // Only do the logic when `onChange` function provided
      if (getListeners(this).change) {
        let connectValueList;

        // Get value by mode
        if (this.isMultiple()) {
          connectValueList = [...missValueList, ...selectorValueList];
        } else {
          connectValueList = selectorValueList.slice(0, 1);
        }

        let labelList = null;
        let returnValue;

        if (this.isLabelInValue()) {
          returnValue = connectValueList.map(({ label, value }) => ({ label, value }));
        } else {
          labelList = [];
          returnValue = connectValueList.map(({ label, value }) => {
            labelList.push(label);
            return value;
          });
        }

        if (!this.isMultiple()) {
          returnValue = returnValue[0];
        }
        this.__emit('change', returnValue, labelList, extra);
      }
    },

    focus() {
      this.selectorRef.current.focus();
    },

    blur() {
      this.selectorRef.current.blur();
    },
  },

  // ===================== Render =====================

  render() {
    const {
      _valueList: valueList,
      _missValueList: missValueList,
      _selectorValueList: selectorValueList,
      _searchHalfCheckedKeys: searchHalfCheckedKeys,
      _valueEntities: valueEntities,
      _keyEntities: keyEntities,
      _searchValue: searchValue,
      _open: open,
      _focused: focused,
      _treeNodes: treeNodes,
      _filteredTreeNodes: filteredTreeNodes,
    } = this.$data;
    const props = getOptionProps(this);
    const { prefixCls, treeExpandedKeys } = props;
    const isMultiple = this.isMultiple();

    const passProps = {
      props: {
        ...props,
        isMultiple,
        valueList,
        searchHalfCheckedKeys,
        selectorValueList: [...missValueList, ...selectorValueList],
        valueEntities,
        keyEntities,
        searchValue,
        upperSearchValue: (searchValue || '').toUpperCase(), // Perf save
        open,
        focused,
        dropdownPrefixCls: `${prefixCls}-dropdown`,
        ariaId: this.ariaId,
      },
      on: {
        ...getListeners(this),
        choiceAnimationLeave: this.onChoiceAnimationLeave,
      },
      scopedSlots: this.$scopedSlots,
    };
    const popupProps = mergeProps(passProps, {
      props: {
        treeNodes,
        filteredTreeNodes,
        // Tree expanded control
        treeExpandedKeys,
        __propsSymbol__: Symbol(),
      },
      on: {
        treeExpanded: this.delayForcePopupAlign,
      },
    });

    const Popup = isMultiple ? MultiplePopup : SinglePopup;
    const $popup = <Popup {...popupProps} />;

    const Selector = isMultiple ? MultipleSelector : SingleSelector;
    const $selector = (
      <Selector
        {...passProps}
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: this.selectorRef,
            },
          ],
        }}
      />
    );
    const selectTriggerProps = mergeProps(passProps, {
      props: {
        popupElement: $popup,
        dropdownVisibleChange: this.onDropdownVisibleChange,
      },
      directives: [
        {
          name: 'ant-ref',
          value: this.selectTriggerRef,
        },
      ],
    });
    return <SelectTrigger {...selectTriggerProps}>{$selector}</SelectTrigger>;
  },
};

Select.TreeNode = SelectNode;
Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

// Let warning show correct component name
Select.name = 'TreeSelect';

export default Select;
