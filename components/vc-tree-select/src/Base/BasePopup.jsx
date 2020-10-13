import { inject } from 'vue';
import warning from 'warning';
import PropTypes from '../../../_util/vue-types';
import Tree from '../../../vc-tree';
import BaseMixin from '../../../_util/BaseMixin';
import { createRef } from '../util';

// export const popupContextTypes = {
//   onPopupKeyDown: PropTypes.func.isRequired,
//   onTreeNodeSelect: PropTypes.func.isRequired,
//   onTreeNodeCheck: PropTypes.func.isRequired,
// }
function getDerivedState(nextProps, prevState) {
  const {
    _prevProps: prevProps = {},
    _loadedKeys: loadedKeys,
    _expandedKeyList: expandedKeyList,
    _cachedExpandedKeyList: cachedExpandedKeyList,
  } = prevState || {};
  const {
    valueList,
    valueEntities,
    keyEntities,
    treeExpandedKeys,
    filteredTreeNodes,
    upperSearchValue,
  } = nextProps;

  const newState = {
    _prevProps: { ...nextProps },
  };

  // Check value update
  if (valueList !== prevProps.valueList) {
    newState._keyList = valueList
      .map(({ value }) => valueEntities[value])
      .filter(entity => entity)
      .map(({ key }) => key);
  }

  // Show all when tree is in filter mode
  if (
    !treeExpandedKeys &&
    filteredTreeNodes &&
    filteredTreeNodes.length &&
    filteredTreeNodes !== prevProps.filteredTreeNodes
  ) {
    newState._expandedKeyList = [...keyEntities.keys()];
  }

  // Cache `expandedKeyList` when filter set
  if (upperSearchValue && !prevProps.upperSearchValue) {
    newState._cachedExpandedKeyList = expandedKeyList;
  } else if (!upperSearchValue && prevProps.upperSearchValue && !treeExpandedKeys) {
    newState._expandedKeyList = cachedExpandedKeyList || [];
    newState._cachedExpandedKeyList = [];
  }

  // Use expandedKeys if provided
  if (prevProps.treeExpandedKeys !== treeExpandedKeys) {
    newState._expandedKeyList = treeExpandedKeys;
  }

  // Clean loadedKeys if key not exist in keyEntities anymore
  if (nextProps.loadData) {
    newState._loadedKeys = loadedKeys.filter(key => keyEntities.has(key));
  }

  return newState;
}
const BasePopup = {
  mixins: [BaseMixin],
  inheritAttrs: false,
  name: 'BasePopup',
  props: {
    prefixCls: PropTypes.string,
    upperSearchValue: PropTypes.string,
    valueList: PropTypes.array,
    searchHalfCheckedKeys: PropTypes.array,
    valueEntities: PropTypes.object,
    keyEntities: Map,
    treeIcon: PropTypes.looseBool,
    treeLine: PropTypes.looseBool,
    treeNodeFilterProp: PropTypes.string,
    treeCheckable: PropTypes.any,
    treeCheckStrictly: PropTypes.looseBool,
    treeDefaultExpandAll: PropTypes.looseBool,
    treeDefaultExpandedKeys: PropTypes.array,
    treeExpandedKeys: PropTypes.array,
    loadData: PropTypes.func,
    multiple: PropTypes.looseBool,
    // onTreeExpand: PropTypes.func,
    searchValue: PropTypes.string,
    treeNodes: PropTypes.any,
    filteredTreeNodes: PropTypes.any,
    notFoundContent: PropTypes.any,

    ariaId: PropTypes.string,
    switcherIcon: PropTypes.any,
    // HOC
    renderSearch: PropTypes.func,
    // onTreeExpanded: PropTypes.func,

    __propsSymbol__: PropTypes.any,
  },
  setup() {
    return {
      vcTreeSelect: inject('vcTreeSelect', {}),
    };
  },
  watch: {
    __propsSymbol__() {
      const state = getDerivedState(this.$props, this.$data);
      this.setState(state);
    },
  },
  data() {
    this.treeRef = createRef();
    warning(this.$props.__propsSymbol__, 'must pass __propsSymbol__');
    const { treeDefaultExpandAll, treeDefaultExpandedKeys, keyEntities } = this.$props;

    // TODO: make `expandedKeyList` control
    let expandedKeyList = treeDefaultExpandedKeys;
    if (treeDefaultExpandAll) {
      expandedKeyList = [...keyEntities.keys()];
    }

    const state = {
      _keyList: [],
      _expandedKeyList: expandedKeyList,
      // Cache `expandedKeyList` when tree is in filter. This is used in `getDerivedState`
      _cachedExpandedKeyList: [],
      _loadedKeys: [],
      _prevProps: {},
    };
    return {
      ...state,
      ...getDerivedState(this.$props, state),
    };
  },
  methods: {
    onTreeExpand(expandedKeyList) {
      const { treeExpandedKeys } = this.$props;

      // Set uncontrolled state
      if (!treeExpandedKeys) {
        this.setState({ _expandedKeyList: expandedKeyList }, () => {
          this.__emit('treeExpanded');
        });
      }
      this.__emit('treeExpand', expandedKeyList);
    },

    onLoad(loadedKeys) {
      this.setState({ _loadedKeys: loadedKeys });
    },

    getTree() {
      return this.treeRef.current;
    },

    /**
     * Not pass `loadData` when searching. To avoid loop ajax call makes browser crash.
     */
    getLoadData() {
      const { loadData, upperSearchValue } = this.$props;
      if (upperSearchValue) return null;
      return loadData;
    },

    /**
     * This method pass to Tree component which is used for add filtered class
     * in TreeNode > li
     */
    filterTreeNode(treeNode) {
      const { upperSearchValue, treeNodeFilterProp } = this.$props;

      const filterVal = treeNode[treeNodeFilterProp];
      if (typeof filterVal === 'string') {
        return upperSearchValue && filterVal.toUpperCase().indexOf(upperSearchValue) !== -1;
      }

      return false;
    },

    renderNotFound() {
      const { prefixCls, notFoundContent } = this.$props;

      return <span class={`${prefixCls}-not-found`}>{notFoundContent}</span>;
    },
  },

  render() {
    const {
      _keyList: keyList,
      _expandedKeyList: expandedKeyList,
      _loadedKeys: loadedKeys,
    } = this.$data;
    const {
      prefixCls,
      treeNodes,
      filteredTreeNodes,
      treeIcon,
      treeLine,
      treeCheckable,
      treeCheckStrictly,
      multiple,
      ariaId,
      renderSearch,
      switcherIcon,
      searchHalfCheckedKeys,
    } = this.$props;
    const {
      vcTreeSelect: { onPopupKeyDown, onTreeNodeSelect, onTreeNodeCheck },
    } = this;

    const loadData = this.getLoadData();

    const treeProps = {};

    if (treeCheckable) {
      treeProps.checkedKeys = keyList;
    } else {
      treeProps.selectedKeys = keyList;
    }
    let $notFound;
    let $treeNodes;
    if (filteredTreeNodes) {
      if (filteredTreeNodes.length) {
        treeProps.checkStrictly = true;
        $treeNodes = filteredTreeNodes;

        // Fill halfCheckedKeys
        if (treeCheckable && !treeCheckStrictly) {
          treeProps.checkedKeys = {
            checked: keyList,
            halfChecked: searchHalfCheckedKeys,
          };
        }
      } else {
        $notFound = this.renderNotFound();
      }
    } else if (!treeNodes || !treeNodes.length) {
      $notFound = this.renderNotFound();
    } else {
      $treeNodes = treeNodes;
    }

    let $tree;
    if ($notFound) {
      $tree = $notFound;
    } else {
      const treeAllProps = {
        prefixCls: `${prefixCls}-tree`,
        showIcon: treeIcon,
        showLine: treeLine,
        selectable: !treeCheckable,
        checkable: treeCheckable,
        checkStrictly: treeCheckStrictly,
        multiple,
        loadData,
        loadedKeys,
        expandedKeys: expandedKeyList,
        filterTreeNode: this.filterTreeNode,
        switcherIcon,
        ...treeProps,
        children: $treeNodes,
        onSelect: onTreeNodeSelect,
        onCheck: onTreeNodeCheck,
        onExpand: this.onTreeExpand,
        onLoad: this.onLoad,
      };
      $tree = <Tree {...treeAllProps} ref={this.treeRef} __propsSymbol__={[]} />;
    }

    return (
      <div role="listbox" id={ariaId} onKeydown={onPopupKeyDown} tabindex={-1}>
        {renderSearch ? renderSearch() : null}
        {$tree}
      </div>
    );
  },
};

export default BasePopup;
