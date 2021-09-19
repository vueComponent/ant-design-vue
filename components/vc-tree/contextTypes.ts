/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */

import type { ComputedRef, InjectionKey, PropType } from 'vue';
import { inject, computed, defineComponent, provide } from 'vue';
import type { VueNode } from '../_util/type';
import type {
  IconType,
  Key,
  DataEntity,
  EventDataNode,
  DragNodeEvent,
  DataNode,
  Direction,
} from './interface';

export type NodeMouseEventParams = {
  event: MouseEvent;
  node: EventDataNode;
};
export type NodeDragEventParams = {
  event: MouseEvent;
  node: EventDataNode;
};

export type NodeMouseEventHandler = (e: MouseEvent, node: EventDataNode) => void;
export type NodeDragEventHandler = (
  e: MouseEvent,
  node: DragNodeEvent,
  outsideTree?: boolean,
) => void;

export interface TreeContextProps {
  prefixCls: string;
  selectable: boolean;
  showIcon: boolean;
  icon: IconType;
  switcherIcon: IconType;
  draggable: ((node: DataNode) => boolean) | boolean;
  checkable: boolean;
  customCheckable: () => any;
  checkStrictly: boolean;
  disabled: boolean;
  keyEntities: Record<Key, DataEntity>;
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
    title?: (data: DataNode) => any;
    titleRender?: (data: DataNode) => any;
    [key: string]: (d: any) => any | undefined;
  };
}
const TreeContextKey: InjectionKey<ComputedRef<TreeContextProps>> = Symbol('TreeContextKey');

export const TreeContext = defineComponent({
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
