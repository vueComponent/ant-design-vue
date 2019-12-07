import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import warning from 'warning';
import { hasProp, initDefaultProps, getOptionProps, getSlots } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import BaseMixin from '../../_util/BaseMixin';
import proxyComponent from '../../_util/proxyComponent';
import {
  convertTreeToEntities,
  convertDataToTree,
  getPosition,
  getDragNodesKeys,
  parseCheckedKeys,
  conductExpandParent,
  calcSelectedKeys,
  calcDropPosition,
  arrAdd,
  arrDel,
  posToArr,
  mapChildren,
  conductCheck,
  warnOnlyTreeNode,
} from './util';

/**
 * Thought we still use `cloneElement` to pass `key`,
 * other props can pass with context for future refactor.
 */

function getWatch(keys = []) {
  const watch = {};
  keys.forEach(k => {
    watch[k] = function() {
      this.needSyncKeys[k] = true;
    };
  });
  return watch;
}

const Tree = {
  name: 'Tree',
  mixins: [BaseMixin],
  props: initDefaultProps(
    {
      prefixCls: PropTypes.string,
      tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      children: PropTypes.any,
      treeData: PropTypes.array, // Generate treeNode by children
      showLine: PropTypes.bool,
      showIcon: PropTypes.bool,
      icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
      focusable: PropTypes.bool,
      selectable: PropTypes.bool,
      disabled: PropTypes.bool,
      multiple: PropTypes.bool,
      checkable: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
      checkStrictly: PropTypes.bool,
      draggable: PropTypes.bool,
      defaultExpandParent: PropTypes.bool,
      autoExpandParent: PropTypes.bool,
      defaultExpandAll: PropTypes.bool,
      defaultExpandedKeys: PropTypes.array,
      expandedKeys: PropTypes.array,
      defaultCheckedKeys: PropTypes.array,
      checkedKeys: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      defaultSelectedKeys: PropTypes.array,
      selectedKeys: PropTypes.array,
      // onClick: PropTypes.func,
      // onDoubleClick: PropTypes.func,
      // onExpand: PropTypes.func,
      // onCheck: PropTypes.func,
      // onSelect: PropTypes.func,
      loadData: PropTypes.func,
      loadedKeys: PropTypes.array,
      // onMouseEnter: PropTypes.func,
      // onMouseLeave: PropTypes.func,
      // onRightClick: PropTypes.func,
      // onDragStart: PropTypes.func,
      // onDragEnter: PropTypes.func,
      // onDragOver: PropTypes.func,
      // onDragLeave: PropTypes.func,
      // onDragEnd: PropTypes.func,
      // onDrop: PropTypes.func,
      filterTreeNode: PropTypes.func,
      openTransitionName: PropTypes.string,
      openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      switcherIcon: PropTypes.any,
      _propsSymbol: PropTypes.any,
    },
    {
      prefixCls: 'rc-tree',
      showLine: false,
      showIcon: true,
      selectable: true,
      multiple: false,
      checkable: false,
      disabled: false,
      checkStrictly: false,
      draggable: false,
      defaultExpandParent: true,
      autoExpandParent: false,
      defaultExpandAll: false,
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      defaultSelectedKeys: [],
    },
  ),

  data() {
    warning(this.$props.__propsSymbol__, 'must pass __propsSymbol__');
    warning(this.$props.children, 'please children prop replace slots.default');
    this.needSyncKeys = {};
    const state = {
      _posEntities: new Map(),
      _keyEntities: new Map(),
      _expandedKeys: [],
      _selectedKeys: [],
      _checkedKeys: [],
      _halfCheckedKeys: [],
      _loadedKeys: [],
      _loadingKeys: [],
      _treeNode: [],
      _prevProps: null,
      _dragOverNodeKey: '',
      _dropPosition: null,
      _dragNodesKeys: [],
    };
    return {
      ...state,
      ...this.getDerivedStateFromProps(getOptionProps(this), state),
    };
  },
  provide() {
    return {
      vcTree: this,
    };
  },

  watch: {
    ...getWatch([
      'treeData',
      'children',
      'expandedKeys',
      'autoExpandParent',
      'selectedKeys',
      'checkedKeys',
      'loadedKeys',
    ]),
    __propsSymbol__() {
      this.setState(this.getDerivedStateFromProps(getOptionProps(this), this.$data));
      this.needSyncKeys = {};
    },
  },

  methods: {
    getDerivedStateFromProps(props, prevState) {
      const { _prevProps } = prevState;
      const newState = {
        _prevProps: { ...props },
      };
      const self = this;
      function needSync(name) {
        return (!_prevProps && name in props) || (_prevProps && self.needSyncKeys[name]);
      }

      // ================== Tree Node ==================
      let treeNode = null;

      // Check if `treeData` or `children` changed and save into the state.
      if (needSync('treeData')) {
        treeNode = convertDataToTree(this.$createElement, props.treeData);
      } else if (needSync('children')) {
        treeNode = props.children;
      }

      // Tree support filter function which will break the tree structure in the vdm.
      // We cache the treeNodes in state so that we can return the treeNode in event trigger.
      if (treeNode) {
        newState._treeNode = treeNode;

        // Calculate the entities data for quick match
        const entitiesMap = convertTreeToEntities(treeNode);
        newState._posEntities = entitiesMap.posEntities;
        newState._keyEntities = entitiesMap.keyEntities;
      }

      const keyEntities = newState._keyEntities || prevState._keyEntities;

      // ================ expandedKeys =================
      if (needSync('expandedKeys') || (_prevProps && needSync('autoExpandParent'))) {
        newState._expandedKeys =
          props.autoExpandParent || (!_prevProps && props.defaultExpandParent)
            ? conductExpandParent(props.expandedKeys, keyEntities)
            : props.expandedKeys;
      } else if (!_prevProps && props.defaultExpandAll) {
        newState._expandedKeys = [...keyEntities.keys()];
      } else if (!_prevProps && props.defaultExpandedKeys) {
        newState._expandedKeys =
          props.autoExpandParent || props.defaultExpandParent
            ? conductExpandParent(props.defaultExpandedKeys, keyEntities)
            : props.defaultExpandedKeys;
      }

      // ================ selectedKeys =================
      if (props.selectable) {
        if (needSync('selectedKeys')) {
          newState._selectedKeys = calcSelectedKeys(props.selectedKeys, props);
        } else if (!_prevProps && props.defaultSelectedKeys) {
          newState._selectedKeys = calcSelectedKeys(props.defaultSelectedKeys, props);
        }
      }

      // ================= checkedKeys =================
      if (props.checkable) {
        let checkedKeyEntity;

        if (needSync('checkedKeys')) {
          checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {};
        } else if (!_prevProps && props.defaultCheckedKeys) {
          checkedKeyEntity = parseCheckedKeys(props.defaultCheckedKeys) || {};
        } else if (treeNode) {
          // If treeNode changed, we also need check it
          checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {
            checkedKeys: prevState._checkedKeys,
            halfCheckedKeys: prevState._halfCheckedKeys,
          };
        }

        if (checkedKeyEntity) {
          let { checkedKeys = [], halfCheckedKeys = [] } = checkedKeyEntity;

          if (!props.checkStrictly) {
            const conductKeys = conductCheck(checkedKeys, true, keyEntities);
            checkedKeys = conductKeys.checkedKeys;
            halfCheckedKeys = conductKeys.halfCheckedKeys;
          }

          newState._checkedKeys = checkedKeys;
          newState._halfCheckedKeys = halfCheckedKeys;
        }
      }
      // ================= loadedKeys ==================
      if (needSync('loadedKeys')) {
        newState._loadedKeys = props.loadedKeys;
      }

      return newState;
    },
    onNodeDragStart(event, node) {
      const { _expandedKeys } = this.$data;
      const { eventKey } = node;
      const children = getSlots(node).default;
      this.dragNode = node;

      this.setState({
        _dragNodesKeys: getDragNodesKeys(
          typeof children === 'function' ? children() : children,
          node,
        ),
        _expandedKeys: arrDel(_expandedKeys, eventKey),
      });
      this.__emit('dragstart', { event, node });
    },

    /**
     * [Legacy] Select handler is less small than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */
    onNodeDragEnter(event, node) {
      const { _expandedKeys: expandedKeys } = this.$data;
      const { pos, eventKey } = node;

      if (!this.dragNode || !node.$refs.selectHandle) return;

      const dropPosition = calcDropPosition(event, node);

      // Skip if drag node is self
      if (this.dragNode.eventKey === eventKey && dropPosition === 0) {
        this.setState({
          _dragOverNodeKey: '',
          _dropPosition: null,
        });
        return;
      }

      // Ref: https://github.com/react-component/tree/issues/132
      // Add timeout to let onDragLevel fire before onDragEnter,
      // so that we can clean drag props for onDragLeave node.
      // Macro task for this:
      // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script
      setTimeout(() => {
        // Update drag over node
        this.setState({
          _dragOverNodeKey: eventKey,
          _dropPosition: dropPosition,
        });

        // Side effect for delay drag
        if (!this.delayedDragEnterLogic) {
          this.delayedDragEnterLogic = {};
        }
        Object.keys(this.delayedDragEnterLogic).forEach(key => {
          clearTimeout(this.delayedDragEnterLogic[key]);
        });
        this.delayedDragEnterLogic[pos] = setTimeout(() => {
          const newExpandedKeys = arrAdd(expandedKeys, eventKey);
          if (!hasProp(this, 'expandedKeys')) {
            this.setState({
              _expandedKeys: newExpandedKeys,
            });
          }
          this.__emit('dragenter', { event, node, expandedKeys: newExpandedKeys });
        }, 400);
      }, 0);
    },
    onNodeDragOver(event, node) {
      const { eventKey } = node;
      const { _dragOverNodeKey, _dropPosition } = this.$data;
      // Update drag position
      if (this.dragNode && eventKey === _dragOverNodeKey && node.$refs.selectHandle) {
        const dropPosition = calcDropPosition(event, node);

        if (dropPosition === _dropPosition) return;

        this.setState({
          _dropPosition: dropPosition,
        });
      }
      this.__emit('dragover', { event, node });
    },
    onNodeDragLeave(event, node) {
      this.setState({
        _dragOverNodeKey: '',
      });
      this.__emit('dragleave', { event, node });
    },
    onNodeDragEnd(event, node) {
      this.setState({
        _dragOverNodeKey: '',
      });
      this.__emit('dragend', { event, node });
      this.dragNode = null;
    },
    onNodeDrop(event, node) {
      const { _dragNodesKeys = [], _dropPosition } = this.$data;

      const { eventKey, pos } = node;

      this.setState({
        _dragOverNodeKey: '',
      });

      if (_dragNodesKeys.indexOf(eventKey) !== -1) {
        warning(false, "Can not drop to dragNode(include it's children node)");
        return;
      }

      const posArr = posToArr(pos);

      const dropResult = {
        event,
        node,
        dragNode: this.dragNode,
        dragNodesKeys: _dragNodesKeys.slice(),
        dropPosition: _dropPosition + Number(posArr[posArr.length - 1]),
      };

      if (_dropPosition !== 0) {
        dropResult.dropToGap = true;
      }
      this.__emit('drop', dropResult);
      this.dragNode = null;
    },

    onNodeClick(e, treeNode) {
      this.__emit('click', e, treeNode);
    },

    onNodeDoubleClick(e, treeNode) {
      this.__emit('dblclick', e, treeNode);
    },

    onNodeSelect(e, treeNode) {
      let { _selectedKeys: selectedKeys } = this.$data;
      const { _keyEntities: keyEntities } = this.$data;
      const { multiple } = this.$props;
      const { selected, eventKey } = getOptionProps(treeNode);
      const targetSelected = !selected;
      // Update selected keys
      if (!targetSelected) {
        selectedKeys = arrDel(selectedKeys, eventKey);
      } else if (!multiple) {
        selectedKeys = [eventKey];
      } else {
        selectedKeys = arrAdd(selectedKeys, eventKey);
      }

      // [Legacy] Not found related usage in doc or upper libs
      const selectedNodes = selectedKeys
        .map(key => {
          const entity = keyEntities.get(key);
          if (!entity) return null;

          return entity.node;
        })
        .filter(node => node);

      this.setUncontrolledState({ _selectedKeys: selectedKeys });

      const eventObj = {
        event: 'select',
        selected: targetSelected,
        node: treeNode,
        selectedNodes,
        nativeEvent: e,
      };
      this.__emit('update:selectedKeys', selectedKeys);
      this.__emit('select', selectedKeys, eventObj);
    },
    onNodeCheck(e, treeNode, checked) {
      const {
        _keyEntities: keyEntities,
        _checkedKeys: oriCheckedKeys,
        _halfCheckedKeys: oriHalfCheckedKeys,
      } = this.$data;
      const { checkStrictly } = this.$props;
      const { eventKey } = getOptionProps(treeNode);

      // Prepare trigger arguments
      let checkedObj;
      const eventObj = {
        event: 'check',
        node: treeNode,
        checked,
        nativeEvent: e,
      };

      if (checkStrictly) {
        const checkedKeys = checked
          ? arrAdd(oriCheckedKeys, eventKey)
          : arrDel(oriCheckedKeys, eventKey);
        const halfCheckedKeys = arrDel(oriHalfCheckedKeys, eventKey);
        checkedObj = { checked: checkedKeys, halfChecked: halfCheckedKeys };

        eventObj.checkedNodes = checkedKeys
          .map(key => keyEntities.get(key))
          .filter(entity => entity)
          .map(entity => entity.node);

        this.setUncontrolledState({ _checkedKeys: checkedKeys });
      } else {
        const { checkedKeys, halfCheckedKeys } = conductCheck([eventKey], checked, keyEntities, {
          checkedKeys: oriCheckedKeys,
          halfCheckedKeys: oriHalfCheckedKeys,
        });

        checkedObj = checkedKeys;

        // [Legacy] This is used for `rc-tree-select`
        eventObj.checkedNodes = [];
        eventObj.checkedNodesPositions = [];
        eventObj.halfCheckedKeys = halfCheckedKeys;

        checkedKeys.forEach(key => {
          const entity = keyEntities.get(key);
          if (!entity) return;

          const { node, pos } = entity;

          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({ node, pos });
        });

        this.setUncontrolledState({
          _checkedKeys: checkedKeys,
          _halfCheckedKeys: halfCheckedKeys,
        });
      }
      this.__emit('check', checkedObj, eventObj);
    },
    onNodeLoad(treeNode) {
      return new Promise(resolve => {
        // We need to get the latest state of loading/loaded keys
        this.setState(({ _loadedKeys: loadedKeys = [], _loadingKeys: loadingKeys = [] }) => {
          const { loadData } = this.$props;
          const { eventKey } = getOptionProps(treeNode);

          if (
            !loadData ||
            loadedKeys.indexOf(eventKey) !== -1 ||
            loadingKeys.indexOf(eventKey) !== -1
          ) {
            return {};
          }

          // Process load data
          const promise = loadData(treeNode);
          promise.then(() => {
            const newLoadedKeys = arrAdd(this.$data._loadedKeys, eventKey);
            const newLoadingKeys = arrDel(this.$data._loadingKeys, eventKey);

            // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
            // https://github.com/ant-design/ant-design/issues/12464
            const eventObj = {
              event: 'load',
              node: treeNode,
            };
            this.__emit('load', newLoadedKeys, eventObj);
            this.setUncontrolledState({
              _loadedKeys: newLoadedKeys,
            });
            this.setState({
              _loadingKeys: newLoadingKeys,
            });
            resolve();
          });

          return {
            _loadingKeys: arrAdd(loadingKeys, eventKey),
          };
        });
      });
    },

    onNodeExpand(e, treeNode) {
      let { _expandedKeys: expandedKeys } = this.$data;
      const { loadData } = this.$props;
      const { eventKey, expanded } = getOptionProps(treeNode);

      // Update selected keys
      const index = expandedKeys.indexOf(eventKey);
      const targetExpanded = !expanded;

      warning(
        (expanded && index !== -1) || (!expanded && index === -1),
        'Expand state not sync with index check',
      );

      if (targetExpanded) {
        expandedKeys = arrAdd(expandedKeys, eventKey);
      } else {
        expandedKeys = arrDel(expandedKeys, eventKey);
      }

      this.setUncontrolledState({ _expandedKeys: expandedKeys });
      this.__emit('expand', expandedKeys, {
        node: treeNode,
        expanded: targetExpanded,
        nativeEvent: e,
      });
      this.__emit('update:expandedKeys', expandedKeys);

      // Async Load data
      if (targetExpanded && loadData) {
        const loadPromise = this.onNodeLoad(treeNode);
        return loadPromise
          ? loadPromise.then(() => {
              // [Legacy] Refresh logic
              this.setUncontrolledState({ _expandedKeys: expandedKeys });
            })
          : null;
      }

      return null;
    },

    onNodeMouseEnter(event, node) {
      this.__emit('mouseenter', { event, node });
    },

    onNodeMouseLeave(event, node) {
      this.__emit('mouseleave', { event, node });
    },

    onNodeContextMenu(event, node) {
      event.preventDefault();
      this.__emit('rightClick', { event, node });
    },

    /**
     * Only update the value which is not in props
     */
    setUncontrolledState(state) {
      let needSync = false;
      const newState = {};
      const props = getOptionProps(this);
      Object.keys(state).forEach(name => {
        if (name.replace('_', '') in props) return;
        needSync = true;
        newState[name] = state[name];
      });

      if (needSync) {
        this.setState(newState);
      }
    },

    isKeyChecked(key) {
      const { _checkedKeys: checkedKeys = [] } = this.$data;
      return checkedKeys.indexOf(key) !== -1;
    },

    /**
     * [Legacy] Original logic use `key` as tracking clue.
     * We have to use `cloneElement` to pass `key`.
     */
    renderTreeNode(child, index, level = 0) {
      const {
        _keyEntities: keyEntities,
        _expandedKeys: expandedKeys = [],
        _selectedKeys: selectedKeys = [],
        _halfCheckedKeys: halfCheckedKeys = [],
        _loadedKeys: loadedKeys = [],
        _loadingKeys: loadingKeys = [],
        _dragOverNodeKey: dragOverNodeKey,
        _dropPosition: dropPosition,
      } = this.$data;
      const pos = getPosition(level, index);
      let key = child.key;
      if (!key && (key === undefined || key === null)) {
        key = pos;
      }
      if (!keyEntities.get(key)) {
        warnOnlyTreeNode();
        return null;
      }

      return cloneElement(child, {
        props: {
          eventKey: key,
          expanded: expandedKeys.indexOf(key) !== -1,
          selected: selectedKeys.indexOf(key) !== -1,
          loaded: loadedKeys.indexOf(key) !== -1,
          loading: loadingKeys.indexOf(key) !== -1,
          checked: this.isKeyChecked(key),
          halfChecked: halfCheckedKeys.indexOf(key) !== -1,
          pos,

          // [Legacy] Drag props
          dragOver: dragOverNodeKey === key && dropPosition === 0,
          dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
          dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1,
        },
        key,
      });
    },
  },

  render() {
    const { _treeNode: treeNode } = this.$data;
    const { prefixCls, focusable, showLine, tabIndex = 0 } = this.$props;
    const domProps = {};

    return (
      <ul
        {...domProps}
        class={classNames(prefixCls, {
          [`${prefixCls}-show-line`]: showLine,
        })}
        role="tree"
        unselectable="on"
        tabIndex={focusable ? tabIndex : null}
        onKeydown={focusable ? this.onKeydown : () => {}}
      >
        {mapChildren(treeNode, (node, index) => this.renderTreeNode(node, index))}
      </ul>
    );
  },
};

export { Tree };

export default proxyComponent(Tree);
