/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */

import type { ComputedRef, InjectionKey, PropType, ShallowRef } from 'vue';
import { shallowRef, inject, computed, defineComponent, provide } from 'vue';
import type { VueNode } from '../_util/type';
import type {
  IconType,
  Key,
  DataEntity,
  EventDataNode,
  DragNodeEvent,
  Direction,
  FlattenNode,
} from './interface';

import type { DraggableConfig } from './Tree';

export type NodeMouseEventParams = {
  event: MouseEvent;
  node: EventDataNode;
};
export type NodeDragEventParams = {
  event: DragEvent;
  node: EventDataNode;
};

export type NodeMouseEventHandler = (e: MouseEvent, node: EventDataNode) => void;
export type NodeDragEventHandler = (
  e: DragEvent,
  node: DragNodeEvent,
  outsideTree?: boolean,
) => void;

export interface TreeContextProps {
  prefixCls: string;
  selectable: boolean;
  showIcon: boolean;
  icon: IconType;
  switcherIcon: IconType;
  draggable: DraggableConfig | false;
  draggingNodeKey?: Key;
  checkable: boolean;
  customCheckable: () => any;
  checkStrictly: boolean;
  disabled: boolean;
  keyEntities: Record<Key, DataEntity<any>>;
  // for details see comment in Tree.state (Tree.tsx)
  dropLevelOffset?: number;
  dropContainerKey: Key | null;
  dropTargetKey: Key | null;
  dropPosition: -1 | 0 | 1 | null;
  indent: number | null;
  dropIndicatorRender: (props: {
    dropPosition: -1 | 0 | 1;
    dropLevelOffset: number;
    indent: number | null;
    prefixCls: string;
    direction: Direction;
  }) => VueNode;
  dragOverNodeKey: Key | null;
  dragging: boolean;
  direction: Direction;

  loadData: (treeNode: EventDataNode) => Promise<void>;
  filterTreeNode: (treeNode: EventDataNode) => boolean;

  onNodeClick: NodeMouseEventHandler;
  onNodeDoubleClick: NodeMouseEventHandler;
  onNodeExpand: NodeMouseEventHandler;
  onNodeSelect: NodeMouseEventHandler;
  onNodeCheck: (e: MouseEvent, treeNode: EventDataNode, checked: boolean) => void;
  onNodeLoad: (treeNode: EventDataNode) => void;
  onNodeMouseEnter: NodeMouseEventHandler;
  onNodeMouseLeave: NodeMouseEventHandler;
  onNodeContextMenu: NodeMouseEventHandler;
  onNodeDragStart: NodeDragEventHandler;
  onNodeDragEnter: NodeDragEventHandler;
  onNodeDragOver: NodeDragEventHandler;
  onNodeDragLeave: NodeDragEventHandler;
  onNodeDragEnd: NodeDragEventHandler;
  onNodeDrop: NodeDragEventHandler;
  slots: {
    title?: (data: any) => any;
    titleRender?: (data: any) => any;
    [key: string]: ((...args: any[]) => any) | undefined;
  };
}
const TreeContextKey: InjectionKey<ComputedRef<TreeContextProps>> = Symbol('TreeContextKey');

export const TreeContext = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TreeContext',
  props: {
    value: { type: Object as PropType<TreeContextProps> },
  },
  setup(props, { slots }) {
    provide(
      TreeContextKey,
      computed(() => props.value),
    );
    return () => slots.default?.();
  },
});

export const useInjectTreeContext = () => {
  return inject(
    TreeContextKey,
    computed(() => ({} as TreeContextProps)),
  );
};
type KeysStateKeyType = {
  expandedKeysSet: ComputedRef<Set<Key>>;
  selectedKeysSet: ComputedRef<Set<Key>>;
  loadedKeysSet: ComputedRef<Set<Key>>;
  loadingKeysSet: ComputedRef<Set<Key>>;
  checkedKeysSet: ComputedRef<Set<Key>>;
  halfCheckedKeysSet: ComputedRef<Set<Key>>;
  expandedKeys: ShallowRef<Key[]>;
  selectedKeys: ShallowRef<Key[]>;
  loadedKeys: ShallowRef<Key[]>;
  loadingKeys: ShallowRef<Key[]>;
  checkedKeys: ShallowRef<Key[]>;
  halfCheckedKeys: ShallowRef<Key[]>;
  flattenNodes: ShallowRef<FlattenNode[]>;
};
const KeysStateKey: InjectionKey<KeysStateKeyType> = Symbol('KeysStateKey');
export const useProvideKeysState = (state: KeysStateKeyType) => {
  provide(KeysStateKey, state);
};

export const useInjectKeysState = () => {
  return inject(KeysStateKey, {
    expandedKeys: shallowRef<Key[]>([]),
    selectedKeys: shallowRef<Key[]>([]),
    loadedKeys: shallowRef<Key[]>([]),
    loadingKeys: shallowRef<Key[]>([]),
    checkedKeys: shallowRef<Key[]>([]),
    halfCheckedKeys: shallowRef<Key[]>([]),
    expandedKeysSet: computed<Set<Key>>(() => new Set()),
    selectedKeysSet: computed<Set<Key>>(() => new Set()),
    loadedKeysSet: computed<Set<Key>>(() => new Set()),
    loadingKeysSet: computed<Set<Key>>(() => new Set()),
    checkedKeysSet: computed<Set<Key>>(() => new Set()),
    halfCheckedKeysSet: computed<Set<Key>>(() => new Set()),
    flattenNodes: shallowRef<FlattenNode[]>([]),
  });
};
