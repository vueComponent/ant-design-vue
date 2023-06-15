import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { BasicDataNode } from '.';
import type { EventHandler } from '../_util/EventInterface';
import PropTypes from '../_util/vue-types';
import type {
  NodeDragEventParams,
  NodeMouseEventHandler,
  NodeMouseEventParams,
} from './contextTypes';
import type { DataNode, Key, FlattenNode, EventDataNode, Direction, FieldNames } from './interface';

export interface CheckInfo {
  event: 'check';
  node: EventDataNode;
  checked: boolean;
  nativeEvent: MouseEvent;
  checkedNodes: DataNode[];
  checkedNodesPositions?: { node: DataNode; pos: string }[];
  halfCheckedKeys?: Key[];
}

export const treeNodeProps = {
  eventKey: [String, Number], // Pass by parent `cloneElement`
  prefixCls: String,

  // By parent
  // expanded: { type: Boolean, default: undefined },
  // selected: { type: Boolean, default: undefined },
  // checked: { type: Boolean, default: undefined },
  // loaded: { type: Boolean, default: undefined },
  // loading: { type: Boolean, default: undefined },
  // halfChecked: { type: Boolean, default: undefined },
  // dragOver: { type: Boolean, default: undefined },
  // dragOverGapTop: { type: Boolean, default: undefined },
  // dragOverGapBottom: { type: Boolean, default: undefined },
  // pos: String,

  title: PropTypes.any,
  /** New added in Tree for easy data access */
  data: { type: Object as PropType<DataNode>, default: undefined as DataNode },
  parent: { type: Object as PropType<DataNode>, default: undefined as DataNode },

  isStart: { type: Array as PropType<boolean[]> },
  isEnd: { type: Array as PropType<boolean[]> },
  active: { type: Boolean, default: undefined },
  onMousemove: { type: Function as PropType<EventHandler> },

  // By user
  isLeaf: { type: Boolean, default: undefined },
  checkable: { type: Boolean, default: undefined },
  selectable: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  disableCheckbox: { type: Boolean, default: undefined },
  icon: PropTypes.any,
  switcherIcon: PropTypes.any,
  domRef: { type: Function as PropType<(arg: any) => void> },
};

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>;

export const nodeListProps = {
  prefixCls: { type: String as PropType<string> },
  // data: { type: Array as PropType<FlattenNode[]> },
  motion: { type: Object as PropType<any> },
  focusable: { type: Boolean as PropType<boolean> },
  activeItem: { type: Object as PropType<FlattenNode> },
  focused: { type: Boolean as PropType<boolean> },
  tabindex: { type: Number as PropType<number> },
  checkable: { type: Boolean as PropType<boolean> },
  selectable: { type: Boolean as PropType<boolean> },
  disabled: { type: Boolean as PropType<boolean> },

  // expandedKeys: { type: Array as PropType<Key[]> },
  // selectedKeys: { type: Array as PropType<Key[]> },
  // checkedKeys: { type: Array as PropType<Key[]> },
  // loadedKeys: { type: Array as PropType<Key[]> },
  // loadingKeys: { type: Array as PropType<Key[]> },
  // halfCheckedKeys: { type: Array as PropType<Key[]> },
  // keyEntities: { type: Object as PropType<Record<Key, DataEntity<DataNode>>> },

  // dragging: { type: Boolean as PropType<boolean> },
  // dragOverNodeKey: { type: [String, Number] as PropType<Key> },
  // dropPosition: { type: Number as PropType<number> },

  // Virtual list
  height: { type: Number as PropType<number> },
  itemHeight: { type: Number as PropType<number> },
  virtual: { type: Boolean as PropType<boolean> },

  onScroll: { type: Function as PropType<EventHandler> },
  onKeydown: { type: Function as PropType<EventHandler> },
  onFocus: { type: Function as PropType<(e: FocusEvent) => void> },
  onBlur: { type: Function as PropType<(e: FocusEvent) => void> },
  onActiveChange: { type: Function as PropType<(key: Key) => void> },
  onContextmenu: { type: Function as PropType<EventHandler> },

  onListChangeStart: { type: Function as PropType<() => void> },
  onListChangeEnd: { type: Function as PropType<() => void> },
};

export type NodeListProps = Partial<ExtractPropTypes<typeof nodeListProps>>;

export interface AllowDropOptions<TreeDataType extends BasicDataNode = DataNode> {
  dragNode: EventDataNode;
  dropNode: TreeDataType;
  dropPosition: -1 | 0 | 1;
}
export type AllowDrop<TreeDataType extends BasicDataNode = DataNode> = (
  options: AllowDropOptions<TreeDataType>,
) => boolean;

export type DraggableFn = (node: DataNode) => boolean;
export type ExpandAction = false | 'click' | 'doubleclick' | 'dblclick';
export const treeProps = () => ({
  prefixCls: String,
  focusable: { type: Boolean, default: undefined },
  activeKey: [Number, String] as PropType<Key>,
  tabindex: Number,
  children: PropTypes.any,
  treeData: { type: Array as PropType<DataNode[]> }, // Generate treeNode by children
  fieldNames: { type: Object as PropType<FieldNames> },
  showLine: {
    type: [Boolean, Object] as PropType<boolean | { showLeafIcon: boolean }>,
    default: undefined,
  },
  showIcon: { type: Boolean, default: undefined },
  icon: PropTypes.any,
  selectable: { type: Boolean, default: undefined },
  expandAction: [String, Boolean] as PropType<ExpandAction>,
  disabled: { type: Boolean, default: undefined },
  multiple: { type: Boolean, default: undefined },
  checkable: { type: Boolean, default: undefined },
  checkStrictly: { type: Boolean, default: undefined },
  draggable: { type: [Function, Boolean] as PropType<DraggableFn | boolean> },
  defaultExpandParent: { type: Boolean, default: undefined },
  autoExpandParent: { type: Boolean, default: undefined },
  defaultExpandAll: { type: Boolean, default: undefined },
  defaultExpandedKeys: { type: Array as PropType<Key[]> },
  expandedKeys: { type: Array as PropType<Key[]> },
  defaultCheckedKeys: { type: Array as PropType<Key[]> },
  checkedKeys: {
    type: [Object, Array] as PropType<Key[] | { checked: Key[]; halfChecked: Key[] }>,
  },
  defaultSelectedKeys: { type: Array as PropType<Key[]> },
  selectedKeys: { type: Array as PropType<Key[]> },
  allowDrop: { type: Function as PropType<AllowDrop> },

  dropIndicatorRender: {
    type: Function as PropType<
      (props: {
        dropPosition: -1 | 0 | 1;
        dropLevelOffset: number;
        indent: number;
        prefixCls: string;
        direction: Direction;
      }) => any
    >,
  },
  onFocus: { type: Function as PropType<(e: FocusEvent) => void> },
  onBlur: { type: Function as PropType<(e: FocusEvent) => void> },
  onKeydown: { type: Function as PropType<EventHandler> },
  onContextmenu: { type: Function as PropType<EventHandler> },
  onClick: { type: Function as PropType<NodeMouseEventHandler> },
  onDblclick: { type: Function as PropType<NodeMouseEventHandler> },
  onScroll: { type: Function as PropType<EventHandler> },
  onExpand: {
    type: Function as PropType<
      (
        expandedKeys: Key[],
        info: {
          node: EventDataNode;
          expanded: boolean;
          nativeEvent: MouseEvent;
        },
      ) => void
    >,
  },
  onCheck: {
    type: Function as PropType<
      (checked: { checked: Key[]; halfChecked: Key[] } | Key[], info: CheckInfo) => void
    >,
  },
  onSelect: {
    type: Function as PropType<
      (
        selectedKeys: Key[],
        info: {
          event: 'select';
          selected: boolean;
          node: EventDataNode;
          selectedNodes: DataNode[];
          nativeEvent: MouseEvent;
        },
      ) => void
    >,
  },
  onLoad: {
    type: Function as PropType<
      (
        loadedKeys: Key[],
        info: {
          event: 'load';
          node: EventDataNode;
        },
      ) => void
    >,
  },
  loadData: { type: Function as PropType<(treeNode: EventDataNode) => Promise<any>> },
  loadedKeys: { type: Array as PropType<Key[]> },
  onMouseenter: { type: Function as PropType<(info: NodeMouseEventParams) => void> },
  onMouseleave: { type: Function as PropType<(info: NodeMouseEventParams) => void> },
  onRightClick: {
    type: Function as PropType<(info: { event: MouseEvent; node: EventDataNode }) => void>,
  },
  onDragstart: { type: Function as PropType<(info: NodeDragEventParams) => void> },
  onDragenter: {
    type: Function as PropType<(info: NodeDragEventParams & { expandedKeys: Key[] }) => void>,
  },
  onDragover: { type: Function as PropType<(info: NodeDragEventParams) => void> },
  onDragleave: { type: Function as PropType<(info: NodeDragEventParams) => void> },
  onDragend: { type: Function as PropType<(info: NodeDragEventParams) => void> },
  onDrop: {
    type: Function as PropType<
      (
        info: NodeDragEventParams & {
          dragNode: EventDataNode;
          dragNodesKeys: Key[];
          dropPosition: number;
          dropToGap: boolean;
        },
      ) => void
    >,
  },
  /**
   * Used for `rc-tree-select` only.
   * Do not use in your production code directly since this will be refactor.
   */
  onActiveChange: { type: Function as PropType<(key: Key) => void> },
  filterTreeNode: { type: Function as PropType<(treeNode: EventDataNode) => boolean> },
  motion: PropTypes.any,
  switcherIcon: PropTypes.any,

  // Virtual List
  height: Number,
  itemHeight: Number,
  virtual: { type: Boolean, default: undefined },

  // direction for drag logic
  direction: { type: String as PropType<Direction> },

  rootClassName: String,
  rootStyle: Object as PropType<CSSProperties>,
});

export type TreeProps = Partial<ExtractPropTypes<ReturnType<typeof treeProps>>>;
