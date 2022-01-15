export type SelectSource = 'option' | 'selection' | 'input' | 'clear';

export type Key = string | number;

export type RawValueType = string | number;

export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: any;
  /** Only works on `treeCheckStrictly` */
  halfChecked?: boolean;
}

export type DefaultValueType = RawValueType | RawValueType[] | LabelValueType | LabelValueType[];

export interface DataNode {
  value?: RawValueType;
  title?: any;
  label?: any;
  key?: Key;
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  selectable?: boolean;
  children?: DataNode[];

  /** Customize data info */
  [prop: string]: any;
}

export interface InternalDataEntity {
  key: Key;
  value: RawValueType;
  title?: any;
  checkable: boolean;
  disableCheckbox: boolean;
  disabled: boolean;
  selectable: boolean;
  isLeaf: boolean;
  children?: InternalDataEntity[];

  /** Origin DataNode */
  node: DataNode;

  dataRef: DataNode;

  slots?: Record<string, string>; // 兼容 V2
}

export interface LegacyDataNode extends DataNode {
  props: any;
}

export interface TreeDataNode extends DataNode {
  key: Key;
  children?: TreeDataNode[];
}

export interface FlattenDataNode {
  data: InternalDataEntity;
  key: Key;
  value: RawValueType;
  level: number;
  parent?: FlattenDataNode;
}

export interface SimpleModeConfig {
  id?: Key;
  pId?: Key;
  rootPId?: Key;
}

/** @deprecated This is only used for legacy compatible. Not works on new code. */
export interface LegacyCheckedNode {
  pos: string;
  node: any;
  children?: LegacyCheckedNode[];
}

export interface ChangeEventExtra {
  /** @deprecated Please save prev value by control logic instead */
  preValue: LabelValueType[];
  triggerValue: RawValueType;
  /** @deprecated Use `onSelect` or `onDeselect` instead. */
  selected?: boolean;
  /** @deprecated Use `onSelect` or `onDeselect` instead. */
  checked?: boolean;

  // Not sure if exist user still use this. We have to keep but not recommend user to use
  /** @deprecated This prop not work as react node anymore. */
  triggerNode: any;
  /** @deprecated This prop not work as react node anymore. */
  allCheckedNodes: LegacyCheckedNode[];
}

export interface FieldNames {
  value?: string;
  label?: string;
  children?: string;
}
