import warning from 'warning';
import PropTypes from '../../../_util/vue-types';
import { Tree } from '../../../vc-tree';
import BaseMixin from '../../../_util/BaseMixin';

// export const popupContextTypes = {
//   onPopupKeyDown: PropTypes.func.isRequired,
//   onTreeNodeSelect: PropTypes.func.isRequired,
//   onTreeNodeCheck: PropTypes.func.isRequired,
// }
function getDerivedStateFromProps(nextProps, prevState) {
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
  name: 'BasePopup',
  props: {
    prefixCls: PropTypes.string,
    upperSearchValue: PropTypes.string,
    valueList: PropTypes.array,
    searchHalfCheckedKeys: PropTypes.array,
    valueEntities: PropTypes.object,
    keyEntities: Map,
    treeIcon: PropTypes.bool,
    treeLine: PropTypes.bool,
    treeNodeFilterProp: PropTypes.string,
    treeCheckable: PropTypes.any,
    treeCheckStrictly: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    treeDefaultExpandedKeys: PropTypes.array,
    treeExpandedKeys: PropTypes.array,
    loadData: PropTypes.func,
    multiple: PropTypes.bool,
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
  inject: {
    vcTreeSelect: { default: () => ({}) },
  },
  watch: {
    __propsSymbol__() {
      const state = getDerivedStateFromProps(this.$props, this.$data);
      this.setState(state);
    },
  },
  data() {
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
      // Cache `expandedKeyList` when tree is in filter. This is used in `getDerivedStateFromProps`
      _cachedExpandedKeyList: [],
      _loadedKeys: [],
      _prevProps: {},
    };
    return {
      ...state,
      ...getDerivedStateFromProps(this.$props, state),
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
      this.__emit('update:treeExpandedKeys', expandedKeyList);
      this.__emit('treeExpand', expandedKeyList);
    },

    onLoad(loadedKeys) {
      this.setState({ _loadedKeys: loadedKeys });
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
    } else if (!treeNodes.length) {
      $notFound = this.renderNotFound();
    } else {
      $treeNodes = treeNodes;
    }

    let $tree;
    if ($notFound) {
      $tree = $notFound;
    } else {
      const treeAllProps = {
        props: {
          prefixCls: `${prefixCls}-tree`,
          showIcon: treeIcon,
          showLine: treeLine,
          selectable: !treeCheckable,
          checkable: treeCheckable,
          checkStrictly: treeCheckStrictly,
          multiple: multiple,
          loadData: loadData,
          loadedKeys: loadedKeys,
          expandedKeys: expandedKeyList,
          filterTreeNode: this.filterTreeNode,
          switcherIcon: switcherIcon,
          ...treeProps,
          __propsSymbol__: Symbol(),
          children: $treeNodes,
        },
        on: {
          select: onTreeNodeSelect,
          check: onTreeNodeCheck,
          expand: this.onTreeExpand,
          load: this.onLoad,
        },
      };
      $tree = <Tree {...treeAllProps} />;
    }

    return (
      <div role="listbox" id={ariaId} onKeydown={onPopupKeyDown} tabIndex={-1}>
        {renderSearch ? renderSearch() : null}
        {$tree}
      </div>
    );
  },
};

export default BasePopup;
