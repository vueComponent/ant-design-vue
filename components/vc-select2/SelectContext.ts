/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { RawValueType, RenderNode } from './BaseSelect';
import type { FlattenOptionData } from './interface';
import type { BaseOptionType, FieldNames, OnActiveValue, OnInternalSelect } from './Select';

// Use any here since we do not get the type during compilation
export interface SelectContextProps {
  options: BaseOptionType[];
  flattenOptions: FlattenOptionData<BaseOptionType>[];
  onActiveValue: OnActiveValue;
  defaultActiveFirstOption?: boolean;
  onSelect: OnInternalSelect;
  menuItemSelectedIcon?: RenderNode;
  rawValues: Set<RawValueType>;
  fieldNames?: FieldNames;
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;
  childrenAsData?: boolean;
}

const SelectContextKey: InjectionKey<SelectContextProps> = Symbol('SelectContextKey');

export function useProvideSelectProps(props: SelectContextProps) {
  return provide(SelectContextKey, props);
}

export default function useSelectProps() {
  return inject(SelectContextKey, {} as SelectContextProps);
}
