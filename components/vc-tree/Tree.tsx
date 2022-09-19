import type { NodeMouseEventHandler, NodeDragEventHandler } from './contextTypes';
import { useProvideKeysState, TreeContext } from './contextTypes';
import {
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
import type { TreeNodeRequiredProps } from './utils/treeUtil';
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
  onUnmounted,
  reactive,
  ref,
  shallowRef,
  watch,
  watchEffect,
  nextTick,
  toRaw,
} from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { CheckInfo, DraggableFn } from './props';
import { treeProps } from './props';
import { warning } from '../vc-util/warning';
import KeyCode from '../_util/KeyCode';
import classNames from '../_util/classNames';
import pickAttrs from '../_util/pickAttrs';
import useMaxLevel from './useMaxLevel';

const MAX_RETRY_TIMES = 10;

export type DraggableConfig = {
  icon?: any;
  nodeDraggable?: DraggableFn;
};

export default defineComponent({
  compatConfig: { MODE: 3 },
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
    const selectedKeys = shallowRef<Key[]>([]);
    const checkedKeys = shallowRef<Key[]>([]);
    const halfCheckedKeys = shallowRef<Key[]>([]);
    const loadedKeys = shallowRef<Key[]>([]);
    const loadingKeys = shallowRef<Key[]>([]);
    const expandedKeys = shallowRef<Key[]>([]);
    const loadingRetryTimes: Record<Key, number> = {};
    const dragState = reactive({
      draggingNodeKey: null,
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
    const treeData = shallowRef([]);
    watch(
      [() => props.treeData, () => props.children],
      () => {
        treeData.value =
          props.treeData !== undefined
            ? toRaw(props.treeData).slice()
            : convertTreeToData(toRaw(props.children));
      },
      {
        immediate: true,
        deep: true,
      },
    );
    const keyEntities = shallowRef({});

    const focused = ref(false);
    const activeKey = ref<Key>(null);

    const listChanging = ref(false);

    const fieldNames = computed(() => fillFieldNames(props.fieldNames));

    const listRef = ref();

    let dragStartMousePosition = null;

    let dragNode: DragNodeEvent = null;

    let currentMouseOverDroppableNodeKey = null;

    const treeNodeRequiredProps = computed<TreeNodeRequiredProps>(() => {
      return {
        expandedKeysSet: expandedKeysSet.value,
        selectedKeysSet: selectedKeysSet.value,
        loadedKeysSet: loadedKeysSet.value,
        loadingKeysSet: loadingKeysSet.value,
        checkedKeysSet: checkedKeysSet.value,
        halfCheckedKeysSet: halfCheckedKeysSet.value,
        dragOverNodeKey: dragState.dragOverNodeKey,
        dropPosition: dragState.dropPosition,
        keyEntities: keyEntities.value,
      };
    });
    const expandedKeysSet = computed(() => {
      return new Set(expandedKeys.value);
    });
    const selectedKeysSet = computed(() => {
      return new Set(selectedKeys.value);
    });
    const loadedKeysSet = computed(() => {
      return new Set(loadedKeys.value);
    });
    const loadingKeysSet = computed(() => {
      return new Set(loadingKeys.value);
    });
    const checkedKeysSet = computed(() => {
      return new Set(checkedKeys.value);
    });
    const halfCheckedKeysSet = computed(() => {
      return new Set(halfCheckedKeys.value);
    });

    watchEffect(() => {
      if (treeData.value) {
        const entitiesMap = convertDataToEntities(treeData.value, {
          fieldNames: fieldNames.value,
        });
        keyEntities.value = {
          [MOTION_KEY]: MotionEntity,
          ...entitiesMap.keyEntities,
        };
      }
    });
    let init = false; // 处理 defaultXxxx api, 仅仅首次有效

    watch(
      [() => props.expandedKeys, () => props.autoExpandParent, keyEntities],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_newKeys, newAutoExpandParent], [_oldKeys, oldAutoExpandParent]) => {
        let keys = expandedKeys.value;
        // ================ expandedKeys =================
        if (
          props.expandedKeys !== undefined ||
          (init && newAutoExpandParent !== oldAutoExpandParent)
        ) {
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
        init = true;
      },
      { immediate: true },
    );

    // ================ flattenNodes =================
    const flattenNodes = shallowRef([]);
    watchEffect(() => {
      flattenNodes.value = flattenTreeData(treeData.value, expandedKeys.value, fieldNames.value);
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
    const { maxLevel, levelEntities } = useMaxLevel(keyEntities);
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
            const conductKeys = conductCheck(
              newCheckedKeys,
              true,
              keyEntities.value,
              maxLevel.value,
              levelEntities.value,
            );
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

    const resetDragState = () => {
      Object.assign(dragState, {
        dragOverNodeKey: null,
        dropPosition: null,
        dropLevelOffset: null,
        dropTargetKey: null,
        dropContainerKey: null,
        dropTargetPos: null,
        dropAllowed: false,
      });
    };
    const scrollTo: ScrollTo = scroll => {
      listRef.value.scrollTo(scroll);
    };
    watch(
      () => props.activeKey,
      () => {
        if (props.activeKey !== undefined) {
          activeKey.value = props.activeKey;
        }
      },
      { immediate: true },
    );
    watch(
      activeKey,
      val => {
        nextTick(() => {
          if (val !== null) {
            scrollTo({ key: val });
          }
        });
      },
      { immediate: true, flush: 'post' },
    );
    // =========================== Expanded ===========================
    /** Set uncontrolled `expandedKeys`. This will also auto update `flattenNodes`. */
    const setExpandedKeys = (keys: Key[]) => {
      if (props.expandedKeys === undefined) {
        expandedKeys.value = keys;
      }
    };

    const cleanDragState = () => {
      if (dragState.draggingNodeKey !== null) {
        Object.assign(dragState, {
          draggingNodeKey: null,
          dropPosition: null,
          dropContainerKey: null,
          dropTargetKey: null,
          dropLevelOffset: null,
          dropAllowed: true,
          dragOverNodeKey: null,
        });
      }
      dragStartMousePosition = null;
      currentMouseOverDroppableNodeKey = null;
    };
    // if onNodeDragEnd is called, onWindowDragEnd won't be called since stopPropagation() is called
    const onNodeDragEnd: NodeDragEventHandler = (event, node) => {
      const { onDragend } = props;

      dragState.dragOverNodeKey = null;

      cleanDragState();

      onDragend?.({ event, node: node.eventData });

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

      dragState.draggingNodeKey = eventKey;
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
    const onNodeDragEnter = (event: DragEvent, node: DragNodeEvent) => {
      const { onDragenter, onExpand, allowDrop, direction } = props;
      const { pos, eventKey } = node;
      // record the key of node which is latest entered, used in dragleave event.
      if (currentMouseOverDroppableNodeKey !== eventKey) {
        currentMouseOverDroppableNodeKey = eventKey;
      }

      if (!dragNode) {
        resetDragState();
        return;
      }
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
        expandedKeysSet.value,
        direction,
      );

      if (
        // don't allow drop inside its children
        dragState.dragChildrenKeys.indexOf(dropTargetKey) !== -1 ||
        // don't allow drop when drop is not allowed caculated by calcDropPosition
        !dropAllowed
      ) {
        resetDragState();
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
        delayedDragEnterLogic[pos] = window.setTimeout(() => {
          if (dragState.draggingNodeKey === null) return;

          let newExpandedKeys = expandedKeys.value.slice();
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
        resetDragState();
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

    const onNodeDragOver = (event: DragEvent, node: DragNodeEvent) => {
      const { onDragover, allowDrop, direction } = props;

      if (!dragNode) {
        return;
      }
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
        expandedKeysSet.value,
        direction,
      );

      if (dragState.dragChildrenKeys.indexOf(dropTargetKey) !== -1 || !dropAllowed) {
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
          resetDragState();
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
      // if it is outside the droppable area
      // currentMouseOverDroppableNodeKey will be updated in dragenter event when into another droppable receiver.
      if (
        currentMouseOverDroppableNodeKey === node.eventKey &&
        !(event.currentTarget as any).contains(event.relatedTarget as Node)
      ) {
        resetDragState();
        currentMouseOverDroppableNodeKey = null;
      }

      const { onDragleave } = props;

      if (onDragleave) {
        onDragleave({ event, node: node.eventData });
      }
    };
    const onNodeDrop = (event: DragEvent, _node, outsideTree = false) => {
      const { dragChildrenKeys, dropPosition, dropTargetKey, dropTargetPos, dropAllowed } =
        dragState;
      if (!dropAllowed) return;

      const { onDrop } = props;

      dragState.dragOverNodeKey = null;
      cleanDragState();

      if (dropTargetKey === null) return;
      const abstractDropNodeProps = {
        ...getTreeNodeProps(dropTargetKey, toRaw(treeNodeRequiredProps.value)),
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

      if (!outsideTree) {
        onDrop?.(dropResult);
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
      const key = treeNode[fieldNames.value.key];

      // Prepare trigger arguments
      let checkedObj;
      const eventObj: Partial<CheckInfo> = {
        event: 'check',
        node: treeNode,
        checked,
        nativeEvent: e,
      };
      const keyEntitiesValue = keyEntities.value;
      if (checkStrictly) {
        const newCheckedKeys = checked
          ? arrAdd(checkedKeys.value, key)
          : arrDel(checkedKeys.value, key);
        const newHalfCheckedKeys = arrDel(halfCheckedKeys.value, key);
        checkedObj = { checked: newCheckedKeys, halfChecked: newHalfCheckedKeys };

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
          keyEntitiesValue,
          maxLevel.value,
          levelEntities.value,
        );

        // If remove, we do it again to correction
        if (!checked) {
          const keySet = new Set(newCheckedKeys);
          keySet.delete(key);
          ({ checkedKeys: newCheckedKeys, halfCheckedKeys: newHalfCheckedKeys } = conductCheck(
            Array.from(keySet),
            { checked: false, halfCheckedKeys: newHalfCheckedKeys },
            keyEntitiesValue,
            maxLevel.value,
            levelEntities.value,
          ));
        }

        checkedObj = newCheckedKeys;

        // [Legacy] This is used for vc-tree-select`
        eventObj.checkedNodes = [];
        eventObj.checkedNodesPositions = [];
        eventObj.halfCheckedKeys = newHalfCheckedKeys;
        newCheckedKeys.forEach(checkedKey => {
          const entity = keyEntitiesValue[checkedKey];
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

    const onNodeLoad = (treeNode: EventDataNode) => {
      const key = treeNode[fieldNames.value.key];
      const loadPromise = new Promise<void>((resolve, reject) => {
        // We need to get the latest state of loading/loaded keys
        const { loadData, onLoad } = props;

        if (!loadData || loadedKeysSet.value.has(key) || loadingKeysSet.value.has(key)) {
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

            // If exceed max retry times, we give up retry
            loadingRetryTimes[key] = (loadingRetryTimes[key] || 0) + 1;
            if (loadingRetryTimes[key] >= MAX_RETRY_TIMES) {
              warning(false, 'Retry for `loadData` many times but still failed. No more retry.');
              const newLoadedKeys = arrAdd(loadedKeys.value, key);
              if (props.loadedKeys === undefined) {
                loadedKeys.value = newLoadedKeys;
              }
              resolve();
            }

            reject(e);
          });

        loadingKeys.value = arrAdd(loadingKeys.value, key);
      });
      // Not care warning if we ignore this
      loadPromise.catch(() => {});

      return loadPromise;
    };
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
      if (props.activeKey !== undefined) {
        activeKey.value = newActiveKey;
      }
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
            if (expandable && expandedKeysSet.value.has(activeKey.value)) {
              onNodeExpand({} as MouseEvent, eventNode);
            } else if (item.parent) {
              onActiveChange(item.parent.key);
            }
            event.preventDefault();
            break;
          }
          case KeyCode.RIGHT: {
            // Expand if possible
            if (expandable && !expandedKeysSet.value.has(activeKey.value)) {
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
              onNodeCheck({} as MouseEvent, eventNode, !checkedKeysSet.value.has(activeKey.value));
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
      selectedKeys: computed(() => selectedKeys.value),
      checkedKeys: computed(() => checkedKeys.value),
      halfCheckedKeys: computed(() => halfCheckedKeys.value),
      loadedKeys: computed(() => loadedKeys.value),
      loadingKeys: computed(() => loadingKeys.value),
      expandedKeys: computed(() => expandedKeys.value),
    });
    onUnmounted(() => {
      window.removeEventListener('dragend', onWindowDragEnd);
      destroyed.value = true;
    });
    useProvideKeysState({
      expandedKeys,
      selectedKeys,
      loadedKeys,
      loadingKeys,
      checkedKeys,
      halfCheckedKeys,
      expandedKeysSet,
      selectedKeysSet,
      loadedKeysSet,
      loadingKeysSet,
      checkedKeysSet,
      halfCheckedKeysSet,
      flattenNodes,
    });
    return () => {
      const {
        // focused,
        // flattenNodes,
        // keyEntities,
        draggingNodeKey,
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
      const domProps = pickAttrs(
        { ...props, ...attrs },
        {
          aria: true,
          data: true,
        },
      );

      // It's better move to hooks but we just simply keep here
      let draggableConfig: DraggableConfig;
      if (draggable) {
        if (typeof draggable === 'object') {
          draggableConfig = draggable;
        } else if (typeof draggable === 'function') {
          draggableConfig = {
            nodeDraggable: draggable,
          };
        } else {
          draggableConfig = {};
        }
      }
      return (
        <TreeContext
          value={{
            prefixCls,
            selectable,
            showIcon,
            icon,
            switcherIcon,
            draggable: draggableConfig,
            draggingNodeKey,
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
            dragging: draggingNodeKey !== null,
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
              disabled={disabled}
              selectable={selectable}
              checkable={!!checkable}
              motion={motion}
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
              {...domProps}
            />
          </div>
        </TreeContext>
      );
    };
  },
});
