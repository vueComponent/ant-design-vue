import type { CSSProperties, VNode } from 'vue';
import type { TreeNodeProps } from './props';
export type { ScrollTo } from '../vc-virtual-list/List';

/** For fieldNames, we provides a abstract interface */
export interface BasicDataNode {
  checkable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  isLeaf?: boolean;
  selectable?: boolean;
  switcherIcon?: IconType;

  /** Set style of TreeNode. This is not recommend if you don't have any force requirement */
  class?: string;
  style?: CSSProperties;
  slots?: Record<string, string>;
  [key: string]: any;
}

export interface DataNode extends BasicDataNode {
  children?: DataNode[];
  key: string | number;
  title?: any;
}

export interface EventDataNode extends DataNode {
  expanded?: boolean;
  selected?: boolean;
  checked: boolean;
  loaded?: boolean;
  loading?: boolean;
  halfChecked?: boolean;
  dragOver?: boolean;
  dragOverGapTop?: boolean;
  dragOverGapBottom?: boolean;
  pos?: string;
  active?: boolean;
  dataRef?: DataNode;
  parent?: DataNode;
  eventKey?: Key; // 兼容 v2， 推荐直接用 key
}

export type IconType = any;

export type Key = string | number;

export type NodeElement = VNode<TreeNodeProps>;

export type DragNodeEvent = {
  key: Key;
  eventData: EventDataNode;
  eventKey: Key;
  selectHandle: HTMLSpanElement;
  pos: string;
};
export interface Entity {
  node: NodeElement;
  index: number;
  key: Key;
  pos: string;
  parent?: Entity;
  children?: Entity[];
}

export interface DataEntity<TreeDataType extends BasicDataNode = DataNode>
  extends Omit<Entity, 'node' | 'parent' | 'children'> {
  node: TreeDataType;
  nodes: TreeDataType[];
  parent?: DataEntity<TreeDataType>;
  children?: DataEntity<TreeDataType>[];
  level: number;
}

export interface FlattenNode {
  parent: FlattenNode | null;
  children: FlattenNode[];
  pos: string;
  data: DataNode;
  title: any;
  key: Key;
  isStart: boolean[];
  isEnd: boolean[];
}

export type GetKey<RecordType> = (record: RecordType, index?: number) => Key;

export type GetCheckDisabled<RecordType> = (record: RecordType) => boolean;

export type Direction = 'ltr' | 'rtl' | undefined;

export interface FieldNames {
  title?: string;
  /** @private Internal usage for `vc-tree-select`, safe to remove if no need */
  _title?: string[];
  key?: string;
  children?: string;
}
