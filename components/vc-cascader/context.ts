import type { CSSProperties, InjectionKey, Ref } from 'vue';
import { inject, provide } from 'vue';
import type { VueNode } from '../_util/type';
import type {
  BaseCascaderProps,
  InternalFieldNames,
  DefaultOptionType,
  SingleValueType,
} from './Cascader';

export interface CascaderContextProps {
  options: Ref<BaseCascaderProps['options']>;
  fieldNames: Ref<InternalFieldNames>;
  values: Ref<SingleValueType[]>;
  halfValues: Ref<SingleValueType[]>;
  changeOnSelect: Ref<boolean>;
  onSelect: (valuePath: SingleValueType) => void;
  checkable: Ref<boolean | VueNode>;
  searchOptions: Ref<DefaultOptionType[]>;
  dropdownPrefixCls?: Ref<string>;
  loadData: Ref<(selectOptions: DefaultOptionType[]) => void>;
  expandTrigger: Ref<'hover' | 'click'>;
  expandIcon: Ref<VueNode>;
  loadingIcon: Ref<VueNode>;
  dropdownMenuColumnStyle: Ref<CSSProperties>;
  customSlots: Ref<Record<string, Function>>;
}

const CascaderContextKey: InjectionKey<CascaderContextProps> = Symbol('CascaderContextKey');
export const useProvideCascader = (props: CascaderContextProps) => {
  provide(CascaderContextKey, props);
};

export const useInjectCascader = () => {
  return inject(CascaderContextKey);
};
