import type { NodeMouseEventHandler, NodeDragEventHandler } from './contextTypes';
import { TreeContext } from './contextTypes';
import {
  getDataAndAria,
  getDragChildrenKeys,
  parseCheckedKeys,
  conductExpandParent,
  calcSelectedKeys,
  calcDropPosition,
  arrAdd,
  arrDel,
  posToArr,
} from './util';
import type { Key, FlattenNode, EventDataNode, ScrollTo, DragNodeEvent } from './interface';
import {
  flattenTreeData,
  convertTreeToData,
  convertDataToEntities,
  convertNodePropsToEventData,
  getTreeNodeProps,
  fillFieldNames,
} from './utils/treeUtil';
import NodeList, { MOTION_KEY, MotionEntity } from './NodeList';
import { conductCheck } from './utils/conductUtil';
import DropIndicator from './DropIndicator';
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  shallowRef,
  watchEffect,
} from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { CheckInfo } from './props';
import { treeProps } from './props';
import { warning } from '../vc-util/warning';
import KeyCode from '../_util/KeyCode';
import classNames from '../_util/classNames';

export default defineComponent({
  name: 'Tree',
  inheritAttrs: false,
  slots: ['checkable', 'title', 'icon', 'titleRender'],
  props: initDefaultProps(treeProps(), {
    prefixCls: 'vc-tree',
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
    dropIndicatorRender: DropIndicator,
    allowDrop: () => true,
  }),

  setup(props, { attrs, slots, expose }) {
    const destroyed = ref(false);
    let delayedDragEnterLogic: Record<Key, number> = {};
    const indent = ref();
    const selectedKeys = shallowRef([]);
    const checkedKeys = shallowRef([]);
    const halfCheckedKeys = shallowRef([]);
    const loadedKeys = shallowRef([]);
    const loadingKeys = shallowRef([]);
    const expandedKeys = shallowRef([]);

    const dragState = reactive({
      dragging: false,
      dragChildrenKeys: [],

      // dropTargetKey is the key of abstract-drop-node
      // the abstract-drop-node is the real drop node when drag and drop
      // not the DOM drag over node
      dropTargetKey: null,
      dropPosition: null, // the drop position of abstract-drop-node, inside 0, top -1, bottom 1
      dropContainerKey: null, // the container key of abstract-drop-node if dropPosition is -1 or 1
      dropLevelOffset: null, // the drop level offset of abstract-drag-over-node
      dropTargetPos: null, // the pos of abstract-drop-node
      dropAllowed: true, // if drop to abstract-drop-node is allowed
      // the abstract-drag-over-node
      // if mouse is on the bottom of top dom node or no the top of the bottom dom node
      // abstract-drag-over-node is the top node
      dragOverNodeKey: null,
    });
    const treeData = computed(() => {
      return props.treeData !== undefined ? props.treeData : convertTreeToData(props.children);
    });
    const keyEntities = shallowRef({});

    const focused = ref(false);
    const activeKey = ref<Key>(null);

    const listChanging = ref(false);

    const fieldNames = computed(() => fillFieldNames(props.fieldNames));

    const listRef = ref();

    let dragStartMousePosition = null;

    let dragNode: DragNodeEvent = null;

    const treeNodeRequiredProps = computed(() => {
      return {
        expandedKeys: expandedKeys.value || [],
        selectedKeys: selectedKeys.value || [],
        loadedKeys: loadedKeys.value || [],
        loadingKeys: loadingKeys.value || [],
        checkedKeys: checkedKeys.value || [],
        halfCheckedKeys: halfCheckedKeys.value || [],
        dragOverNodeKey: dragState.dragOverNodeKey,
        dropPosition: dragState.dropPosition,
        keyEntities: keyEntities.value,
      };
    });

    watchEffect(() => {
      if (treeData.value) {
        const entitiesMap = convertDataToEntities(treeData.value, { fieldNames: fieldNames.value });
        keyEntities.value = {
          [MOTION_KEY]: MotionEntity,
          ...entitiesMap.keyEntities,
        };
      }
    });
    let init = false; // 处理 defaultXxxx api, 仅仅首次有效

    onMounted(() => {
      init = true;
    });

    // ================ expandedKeys =================
    watchEffect(() => {
      let keys = expandedKeys.value;
      // ================ expandedKeys =================
      if (props.expandedKeys !== undefined || (init && props.autoExpandParent)) {
        keys =
          props.autoExpandParent || (!init && props.defaultExpandParent)
            ? conductExpandParent(props.expandedKeys, keyEntities.value)
            : props.expandedKeys;
      } else if (!init && props.defaultExpandAll) {
        const cloneKeyEntities = { ...keyEntities.value };
        delete cloneKeyEntities[MOTION_KEY];
        keys = Object.keys(cloneKeyEntities).map(key => cloneKeyEntities[key].key);
      } else if (!init && props.defaultExpandedKeys) {
        keys =
          props.autoExpandParent || props.defaultExpandParent
            ? conductExpandParent(props.defaultExpandedKeys, keyEntities.value)
            : props.defaultExpandedKeys;
      }

      if (keys) {
        expandedKeys.value = keys;
      }
    });

    // ================ flattenNodes =================
    const flattenNodes = computed(() => {
      return flattenTreeData(treeData.value, expandedKeys.value, fieldNames.value);
    });
    // ================ selectedKeys =================
    watchEffect(() => {
      if (props.selectable) {
        if (props.selectedKeys !== undefined) {
          selectedKeys.value = calcSelectedKeys(props.selectedKeys, props);
        } else if (!init && props.defaultSelectedKeys) {
          selectedKeys.value = calcSelectedKeys(props.defaultSelectedKeys, props);
        }
      }
    });

    // ================= checkedKeys =================
    watchEffect(() => {
      if (props.checkable) {
        let checkedKeyEntity;

        if (props.checkedKeys !== undefined) {
          checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {};
        } else if (!init && props.defaultCheckedKeys) {
          checkedKeyEntity = parseCheckedKeys(props.defaultCheckedKeys) || {};
        } else if (treeData.value) {
          // If `treeData` changed, we also need check it
          checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {
            checkedKeys: checkedKeys.value,
            halfCheckedKeys: halfCheckedKeys.value,
          };
        }

        if (checkedKeyEntity) {
          let { checkedKeys: newCheckedKeys = [], halfCheckedKeys: newHalfCheckedKeys = [] } =
            checkedKeyEntity;

          if (!props.checkStrictly) {
            const conductKeys = conductCheck(newCheckedKeys, true, keyEntities.value);
            ({ checkedKeys: newCheckedKeys, halfCheckedKeys: newHalfCheckedKeys } = conductKeys);
          }

          checkedKeys.value = newCheckedKeys;
          halfCheckedKeys.value = newHalfCheckedKeys;
        }
      }
    });

    // ================= loadedKeys ==================
    watchEffect(() => {
      if (props.loadedKeys) {
        loadedKeys.value = props.loadedKeys;
      }
    });

    const scrollTo: ScrollTo = scroll => {
      listRef.value.scrollTo(scroll);
    };
    // =========================== Expanded ===========================
    /** Set uncontrolled `expandedKeys`. This will also auto update `flattenNodes`. */
    const setExpandedKeys = (keys: Key[]) => {
      if (props.expandedKeys === undefined) {
        expandedKeys.value = keys;
      }
    };

    const cleanDragState = () => {
      if (dragState.dragging) {
        Object.assign(dragState, {
          dragging: false,
          dropPosition: null,
          dropContainerKey: null,
          dropTargetKey: null,
          dropLevelOffset: null,
          dropAllowed: true,
          dragOverNodeKey: null,
        });
      }
      dragStartMousePosition = null;
    };
    // if onNodeDragEnd is called, onWindowDragEnd won't be called since stopPropagation() is called
    const onNodeDragEnd: NodeDragEventHandler = (event, node, outsideTree = false) => {
      const { onDragend } = props;

      dragState.dragOverNodeKey = null;

      cleanDragState();

      if (onDragend && !outsideTree) {
        onDragend({ event, node: node.eventData });
      }

      dragNode = null;
    };

    // since stopPropagation() is called in treeNode
    // if onWindowDrag is called, whice means state is keeped, drag state should be cleared
    const onWindowDragEnd = event => {
      onNodeDragEnd(event, null, true);
      window.removeEventListener('dragend', onWindowDragEnd);
    };

    const onNodeDragStart: NodeDragEventHandler = (event, node) => {
      const { onDragstart } = props;
      const { eventKey, eventData } = node;
      dragNode = node;
      dragStartMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };

      const newExpandedKeys = arrDel(expandedKeys.value, eventKey);

      dragState.dragging = true;
      dragState.dragChildrenKeys = getDragChildrenKeys(eventKey, keyEntities.value);
      indent.value = listRef.value.getIndentWidth();

      setExpandedKeys(newExpandedKeys);
      window.addEventListener('dragend', onWindowDragEnd);

      if (onDragstart) {
        onDragstart({ event, node: eventData });
      }
    };

    /**
     * [Legacy] Select handler is smaller than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */
    const onNodeDragEnter = (event: MouseEvent, node: DragNodeEvent) => {
      const { onDragenter, onExpand, allowDrop, direction } = props;

      const {
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropTargetPos,
        dropAllowed,
        dragOverNodeKey,
      } = calcDropPosition(
        event,
        dragNode,
        node,
        indent.value,
        dragStartMousePosition,
        allowDrop,
        flattenNodes.value,
        keyEntities.value,
        expandedKeys.value,
        direction,
      );

      if (
        !dragNode ||
        // don't allow drop inside its children
        dragState.dragChildrenKeys.indexOf(dropTargetKey) !== -1 ||
        // don't allow drop when drop is not allowed caculated by calcDropPosition
        !dropAllowed
      ) {
        Object.assign(dragState, {
          dragOverNodeKey: null,
          dropPosition: null,
          dropLevelOffset: null,
          dropTargetKey: null,
          dropContainerKey: null,
          dropTargetPos: null,
          dropAllowed: false,
        });
        return;
      }

      // Side effect for delay drag
      if (!delayedDragEnterLogic) {
        delayedDragEnterLogic = {};
      }
      Object.keys(delayedDragEnterLogic).forEach(key => {
        clearTimeout(delayedDragEnterLogic[key]);
      });

      if (dragNode.eventKey !== node.eventKey) {
        // hoist expand logic here
        // since if logic is on the bottom
        // it will be blocked by abstract dragover node check
        //   => if you dragenter from top, you mouse will still be consider as in the top node
        delayedDragEnterLogic[node.pos] = window.setTimeout(() => {
          if (!dragState.dragging) return;

          let newExpandedKeys = [...expandedKeys.value];
          const entity = keyEntities.value[node.eventKey];

          if (entity && (entity.children || []).length) {
            newExpandedKeys = arrAdd(expandedKeys.value, node.eventKey);
          }
          setExpandedKeys(newExpandedKeys);

          if (onExpand) {
            onExpand(newExpandedKeys, {
              node: node.eventData,
              expanded: true,
              nativeEvent: event,
            });
          }
        }, 800);
      }

      // Skip if drag node is self
      if (dragNode.eventKey === dropTargetKey && dropLevelOffset === 0) {
        Object.assign(dragState, {
          dragOverNodeKey: null,
          dropPosition: null,
          dropLevelOffset: null,
          dropTargetKey: null,
          dropContainerKey: null,
          dropTargetPos: null,
          dropAllowed: false,
        });
        return;
      }

      // Update drag over node and drag state
      Object.assign(dragState, {
        dragOverNodeKey,
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropTargetPos,
        dropAllowed,
      });

      if (onDragenter) {
        onDragenter({
          event,
          node: node.eventData,
          expandedKeys: expandedKeys.value,
        });
      }
    };

    const onNodeDragOver = (event: MouseEvent, node: DragNodeEvent) => {
      const { onDragover, allowDrop, direction } = props;

      const {
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropAllowed,
        dropTargetPos,
        dragOverNodeKey,
      } = calcDropPosition(
        event,
        dragNode,
        node,
        indent.value,
        dragStartMousePosition,
        allowDrop,
        flattenNodes.value,
        keyEntities.value,
        expandedKeys.value,
        direction,
      );

      if (!dragNode || dragState.dragChildrenKeys.indexOf(dropTargetKey) !== -1 || !dropAllowed) {
        // don't allow drop inside its children
        // don't allow drop when drop is not allowed caculated by calcDropPosition
        return;
      }

      // Update drag position

      if (dragNode.eventKey === dropTargetKey && dropLevelOffset === 0) {
        if (
          !(
            dragState.dropPosition === null &&
            dragState.dropLevelOffset === null &&
            dragState.dropTargetKey === null &&
            dragState.dropContainerKey === null &&
            dragState.dropTargetPos === null &&
            dragState.dropAllowed === false &&
            dragState.dragOverNodeKey === null
          )
        ) {
          Object.assign(dragState, {
            dropPosition: null,
            dropLevelOffset: null,
            dropTargetKey: null,
            dropContainerKey: null,
            dropTargetPos: null,
            dropAllowed: false,
            dragOverNodeKey: null,
          });
        }
      } else if (
        !(
          dropPosition === dragState.dropPosition &&
          dropLevelOffset === dragState.dropLevelOffset &&
          dropTargetKey === dragState.dropTargetKey &&
          dropContainerKey === dragState.dropContainerKey &&
          dropTargetPos === dragState.dropTargetPos &&
          dropAllowed === dragState.dropAllowed &&
          dragOverNodeKey === dragState.dragOverNodeKey
        )
      ) {
        Object.assign(dragState, {
          dropPosition,
          dropLevelOffset,
          dropTargetKey,
          dropContainerKey,
          dropTargetPos,
          dropAllowed,
          dragOverNodeKey,
        });
      }

      if (onDragover) {
        onDragover({ event, node: node.eventData });
      }
    };

    const onNodeDragLeave: NodeDragEventHandler = (event, node) => {
      const { onDragleave } = props;

      if (onDragleave) {
        onDragleave({ event, node: node.eventData });
      }
    };
    const onNodeDrop = (event: MouseEvent, _node, outsideTree = false) => {
      const { dragChildrenKeys, dropPosition, dropTargetKey, dropTargetPos, dropAllowed } =
        dragState;

      if (!dropAllowed) return;

      const { onDrop } = props;

      dragState.dragOverNodeKey = null;
      cleanDragState();

      if (dropTargetKey === null) return;
      const abstractDropNodeProps = {
        ...getTreeNodeProps(dropTargetKey, treeNodeRequiredProps.value),
        active: activeItem.value?.key === dropTargetKey,
        data: keyEntities.value[dropTargetKey].node,
      };
      const dropToChild = dragChildrenKeys.indexOf(dropTargetKey) !== -1;

      warning(
        !dropToChild,
        "Can not drop to dragNode's children node. Maybe this is a bug of ant-design-vue. Please report an issue.",
      );

      const posArr = posToArr(dropTargetPos);

      const dropResult = {
        event,
        node: convertNodePropsToEventData(abstractDropNodeProps),
        dragNode: dragNode ? dragNode.eventData : null,
        dragNodesKeys: [dragNode.eventKey].concat(dragChildrenKeys),
        dropToGap: dropPosition !== 0,
        dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
      };

      if (onDrop && !outsideTree) {
        onDrop(dropResult);
      }

      dragNode = null;
    };

    const onNodeClick: NodeMouseEventHandler = (e, treeNode) => {
      const { onClick } = props;
      if (onClick) {
        onClick(e, treeNode);
      }
    };

    const onNodeDoubleClick: NodeMouseEventHandler = (e, treeNode) => {
      const { onDblclick } = props;
      if (onDblclick) {
        onDblclick(e, treeNode);
      }
    };

    const onNodeSelect: NodeMouseEventHandler = (e, treeNode) => {
      let newSelectedKeys = selectedKeys.value;
      const { onSelect, multiple } = props;
      const { selected } = treeNode;
      const key = treeNode[fieldNames.value.key];
      const targetSelected = !selected;

      // Update selected keys
      if (!targetSelected) {
        newSelectedKeys = arrDel(newSelectedKeys, key);
      } else if (!multiple) {
        newSelectedKeys = [key];
      } else {
        newSelectedKeys = arrAdd(newSelectedKeys, key);
      }

      // [Legacy] Not found related usage in doc or upper libs
      const keyEntitiesValue = keyEntities.value;
      const selectedNodes = newSelectedKeys
        .map(selectedKey => {
          const entity = keyEntitiesValue[selectedKey];
          if (!entity) return null;

          return entity.node;
        })
        .filter(node => node);

      if (props.selectedKeys === undefined) {
        selectedKeys.value = newSelectedKeys;
      }

      if (onSelect) {
        onSelect(newSelectedKeys, {
          event: 'select',
          selected: targetSelected,
          node: treeNode,
          selectedNodes,
          nativeEvent: e,
        });
      }
    };

    const onNodeCheck = (e: MouseEvent, treeNode: EventDataNode, checked: boolean) => {
      const { checkStrictly, onCheck } = props;
      const { key } = treeNode;

      // Prepare trigger arguments
      let checkedObj;
      const eventObj: Partial<CheckInfo> = {
        event: 'check',
        node: treeNode,
        checked,
        nativeEvent: e,
      };

      if (checkStrictly) {
        const newCheckedKeys = checked
          ? arrAdd(checkedKeys.value, key)
          : arrDel(checkedKeys.value, key);
        const newHalfCheckedKeys = arrDel(halfCheckedKeys.value, key);
        checkedObj = { checked: newCheckedKeys, halfChecked: newHalfCheckedKeys };

        const keyEntitiesValue = keyEntities.value;
        eventObj.checkedNodes = newCheckedKeys
          .map(checkedKey => keyEntitiesValue[checkedKey])
          .filter(entity => entity)
          .map(entity => entity.node);

        if (props.checkedKeys === undefined) {
          checkedKeys.value = newCheckedKeys;
        }
      } else {
        // Always fill first
        let { checkedKeys: newCheckedKeys, halfCheckedKeys: newHalfCheckedKeys } = conductCheck(
          [...checkedKeys.value, key],
          true,
          keyEntities.value,
        );

        // If remove, we do it again to correction
        if (!checked) {
          const keySet = new Set(newCheckedKeys);
          keySet.delete(key);
          ({ checkedKeys: newCheckedKeys, halfCheckedKeys: newHalfCheckedKeys } = conductCheck(
            Array.from(keySet),
            { checked: false, halfCheckedKeys: newHalfCheckedKeys },
            keyEntities.value,
          ));
        }

        checkedObj = newCheckedKeys;

        // [Legacy] This is used for vc-tree-select`
        eventObj.checkedNodes = [];
        eventObj.checkedNodesPositions = [];
        eventObj.halfCheckedKeys = newHalfCheckedKeys;
        newCheckedKeys.forEach(checkedKey => {
          const entity = keyEntities.value[checkedKey];
          if (!entity) return;

          const { node, pos } = entity;
          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({ node, pos });
        });
        if (props.checkedKeys === undefined) {
          checkedKeys.value = newCheckedKeys;
          halfCheckedKeys.value = newHalfCheckedKeys;
        }
      }

      if (onCheck) {
        onCheck(checkedObj, eventObj as CheckInfo);
      }
    };

    const onNodeLoad = (treeNode: EventDataNode) =>
      new Promise<void>((resolve, reject) => {
        // We need to get the latest state of loading/loaded keys
        const { loadData, onLoad } = props;
        const key = treeNode[fieldNames.value.key];

        if (
          !loadData ||
          loadedKeys.value.indexOf(key) !== -1 ||
          loadingKeys.value.indexOf(key) !== -1
        ) {
          return null;
        }

        // Process load data
        const promise = loadData(treeNode);
        promise
          .then(() => {
            const newLoadedKeys = arrAdd(loadedKeys.value, key);
            const newLoadingKeys = arrDel(loadingKeys.value, key);

            // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
            // https://github.com/ant-design/ant-design/issues/12464
            if (onLoad) {
              onLoad(newLoadedKeys, {
                event: 'load',
                node: treeNode,
              });
            }

            if (props.loadedKeys === undefined) {
              loadedKeys.value = newLoadedKeys;
            }
            loadingKeys.value = newLoadingKeys;
            resolve();
          })
          .catch(e => {
            const newLoadingKeys = arrDel(loadingKeys.value, key);
            loadingKeys.value = newLoadingKeys;
            reject(e);
          });

        loadingKeys.value = arrAdd(loadingKeys.value, key);
      });

    const onNodeMouseEnter: NodeMouseEventHandler = (event, node) => {
      const { onMouseenter } = props;
      if (onMouseenter) {
        onMouseenter({ event, node });
      }
    };

    const onNodeMouseLeave: NodeMouseEventHandler = (event, node) => {
      const { onMouseleave } = props;
      if (onMouseleave) {
        onMouseleave({ event, node });
      }
    };

    const onNodeContextMenu: NodeMouseEventHandler = (event, node) => {
      const { onRightClick } = props;
      if (onRightClick) {
        event.preventDefault();
        onRightClick({ event, node });
      }
    };

    const onFocus = (e: FocusEvent) => {
      const { onFocus } = props;
      focused.value = true;
      if (onFocus) {
        onFocus(e);
      }
    };

    const onBlur = (e: FocusEvent) => {
      const { onBlur } = props;
      focused.value = false;
      onActiveChange(null);

      if (onBlur) {
        onBlur(e);
      }
    };

    const onNodeExpand = (e: MouseEvent, treeNode: EventDataNode) => {
      let newExpandedKeys = expandedKeys.value;
      const { onExpand, loadData } = props;
      const { expanded } = treeNode;
      const key = treeNode[fieldNames.value.key];

      // Do nothing when motion is in progress
      if (listChanging.value) {
        return;
      }

      // Update selected keys
      const index = newExpandedKeys.indexOf(key);
      const targetExpanded = !expanded;

      warning(
        (expanded && index !== -1) || (!expanded && index === -1),
        'Expand state not sync with index check',
      );

      if (targetExpanded) {
        newExpandedKeys = arrAdd(newExpandedKeys, key);
      } else {
        newExpandedKeys = arrDel(newExpandedKeys, key);
      }

      setExpandedKeys(newExpandedKeys);

      if (onExpand) {
        onExpand(newExpandedKeys, {
          node: treeNode,
          expanded: targetExpanded,
          nativeEvent: e,
        });
      }

      // Async Load data
      if (targetExpanded && loadData) {
        const loadPromise = onNodeLoad(treeNode);
        if (loadPromise) {
          loadPromise
            .then(() => {
              // [Legacy] Refresh logic
              // const newFlattenTreeData = flattenTreeData(
              //   treeData.value,
              //   newExpandedKeys,
              //   fieldNames.value,
              // );
              // flattenNodes.value = newFlattenTreeData;
            })
            .catch(e => {
              const expandedKeysToRestore = arrDel(expandedKeys.value, key);
              setExpandedKeys(expandedKeysToRestore);
              Promise.reject(e);
            });
        }
      }
    };

    const onListChangeStart = () => {
      listChanging.value = true;
    };

    const onListChangeEnd = () => {
      setTimeout(() => {
        listChanging.value = false;
      });
    };

    // =========================== Keyboard ===========================
    const onActiveChange = (newActiveKey: Key) => {
      const { onActiveChange } = props;

      if (activeKey.value === newActiveKey) {
        return;
      }

      activeKey.value = newActiveKey;
      if (newActiveKey !== null) {
        scrollTo({ key: newActiveKey });
      }

      if (onActiveChange) {
        onActiveChange(newActiveKey);
      }
    };

    const activeItem = computed<FlattenNode>(() => {
      if (activeKey.value === null) {
        return null;
      }

      return flattenNodes.value.find(({ key }) => key === activeKey.value) || null;
    });

    const offsetActiveKey = (offset: number) => {
      let index = flattenNodes.value.findIndex(({ key }) => key === activeKey.value);

      // Align with index
      if (index === -1 && offset < 0) {
        index = flattenNodes.value.length;
      }

      index = (index + offset + flattenNodes.value.length) % flattenNodes.value.length;

      const item = flattenNodes.value[index];
      if (item) {
        const { key } = item;
        onActiveChange(key);
      } else {
        onActiveChange(null);
      }
    };
    const activeItemEventNode = computed(() => {
      return convertNodePropsToEventData({
        ...getTreeNodeProps(activeKey.value, treeNodeRequiredProps.value),
        data: activeItem.value.data,
        active: true,
      });
    });
    const onKeydown = event => {
      const { onKeydown, checkable, selectable } = props;

      // >>>>>>>>>> Direction
      switch (event.which) {
        case KeyCode.UP: {
          offsetActiveKey(-1);
          event.preventDefault();
          break;
        }
        case KeyCode.DOWN: {
          offsetActiveKey(1);
          event.preventDefault();
          break;
        }
      }

      // >>>>>>>>>> Expand & Selection
      const item = activeItem.value;
      if (item && item.data) {
        const expandable = item.data.isLeaf === false || !!(item.data.children || []).length;
        const eventNode = activeItemEventNode.value;

        switch (event.which) {
          // >>> Expand
          case KeyCode.LEFT: {
            // Collapse if possible
            if (expandable && expandedKeys.value.includes(activeKey.value)) {
              onNodeExpand({} as MouseEvent, eventNode);
            } else if (item.parent) {
              onActiveChange(item.parent.key);
            }
            event.preventDefault();
            break;
          }
          case KeyCode.RIGHT: {
            // Expand if possible
            if (expandable && !expandedKeys.value.includes(activeKey.value)) {
              onNodeExpand({} as MouseEvent, eventNode);
            } else if (item.children && item.children.length) {
              onActiveChange(item.children[0].key);
            }
            event.preventDefault();
            break;
          }

          // Selection
          case KeyCode.ENTER:
          case KeyCode.SPACE: {
            if (
              checkable &&
              !eventNode.disabled &&
              eventNode.checkable !== false &&
              !eventNode.disableCheckbox
            ) {
              onNodeCheck(
                {} as MouseEvent,
                eventNode,
                !checkedKeys.value.includes(activeKey.value),
              );
            } else if (
              !checkable &&
              selectable &&
              !eventNode.disabled &&
              eventNode.selectable !== false
            ) {
              onNodeSelect({} as MouseEvent, eventNode);
            }
            break;
          }
        }
      }

      if (onKeydown) {
        onKeydown(event);
      }
    };
    expose({
      onNodeExpand,
      scrollTo,
      onKeydown,
    });
    onUnmounted(() => {
      window.removeEventListener('dragend', onWindowDragEnd);
      destroyed.value = true;
    });
    return () => {
      const {
        // focused,
        // flattenNodes,
        // keyEntities,
        dragging,
        // activeKey,
        dropLevelOffset,
        dropContainerKey,
        dropTargetKey,
        dropPosition,
        dragOverNodeKey,
        // indent,
      } = dragState;
      const {
        prefixCls,
        showLine,
        focusable,
        tabindex = 0,
        selectable,
        showIcon,
        icon = slots.icon,
        switcherIcon,
        draggable,
        checkable,
        checkStrictly,
        disabled,
        motion,
        loadData,
        filterTreeNode,
        height,
        itemHeight,
        virtual,
        dropIndicatorRender,
        onContextmenu,
        onScroll,
        direction,
      } = props;

      const { class: className, style } = attrs;
      const domProps = getDataAndAria({ ...props, ...attrs });
      return (
        <TreeContext
          value={{
            prefixCls,
            selectable,
            showIcon,
            icon,
            switcherIcon,
            draggable,
            checkable,
            customCheckable: slots.checkable,
            checkStrictly,
            disabled,
            keyEntities: keyEntities.value,
            dropLevelOffset,
            dropContainerKey,
            dropTargetKey,
            dropPosition,
            dragOverNodeKey,
            indent: indent.value,
            direction,
            dropIndicatorRender,

            loadData,
            filterTreeNode,

            onNodeClick,
            onNodeDoubleClick,
            onNodeExpand,
            onNodeSelect,
            onNodeCheck,
            onNodeLoad,
            onNodeMouseEnter,
            onNodeMouseLeave,
            onNodeContextMenu,
            onNodeDragStart,
            onNodeDragEnter,
            onNodeDragOver,
            onNodeDragLeave,
            onNodeDragEnd,
            onNodeDrop,
            slots,
          }}
        >
          <div
            role="tree"
            class={classNames(prefixCls, className, {
              [`${prefixCls}-show-line`]: showLine,
              [`${prefixCls}-focused`]: focused.value,
              [`${prefixCls}-active-focused`]: activeKey.value !== null,
            })}
          >
            <NodeList
              ref={listRef}
              prefixCls={prefixCls}
              style={style}
              data={flattenNodes.value}
              disabled={disabled}
              selectable={selectable}
              checkable={!!checkable}
              motion={motion}
              dragging={dragging}
              height={height}
              itemHeight={itemHeight}
              virtual={virtual}
              focusable={focusable}
              focused={focused.value}
              tabindex={tabindex}
              activeItem={activeItem.value}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeydown={onKeydown}
              onActiveChange={onActiveChange}
              onListChangeStart={onListChangeStart}
              onListChangeEnd={onListChangeEnd}
              onContextmenu={onContextmenu}
              onScroll={onScroll}
              {...treeNodeRequiredProps.value}
              {...domProps}
            />
          </div>
        </TreeContext>
      );
    };
  },
});
