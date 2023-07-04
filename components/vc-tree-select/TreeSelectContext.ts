import type { InjectionKey } from 'vue';
import { provide, inject } from 'vue';
import type { DefaultOptionType, InternalFieldName, OnInternalSelect } from './TreeSelect';

export interface TreeSelectContextProps {
  virtual?: boolean;
  listHeight: number;
  listItemHeight: number;
  treeData: DefaultOptionType[];
  fieldNames: InternalFieldName;
  onSelect: OnInternalSelect;
}

const TreeSelectContextPropsKey: InjectionKey<TreeSelectContextProps> = Symbol(
  'TreeSelectContextPropsKey',
);

export function useProvideSelectContext(props: TreeSelectContextProps) {
  return provide(TreeSelectContextPropsKey, props);
}
export default function useInjectSelectContext() {
  return inject(TreeSelectContextPropsKey, {} as TreeSelectContextProps);
}
