import { VueNode } from '../../_util/type';
import { VNodeChild } from 'vue';

export type SelectSource = 'option' | 'selection' | 'input';

export const INTERNAL_PROPS_MARK = 'RC_SELECT_INTERNAL_PROPS_MARK';

// =================================== Shared Type ===================================
export type Key = string | number;

export type RawValueType = string | number | null;

export interface LabelValueType extends Record<string, any> {
  key?: Key;
  value?: RawValueType;
  label?: VNodeChild;
}
export type DefaultValueType = RawValueType | RawValueType[] | LabelValueType | LabelValueType[];

export interface DisplayLabelValueType extends LabelValueType {
  disabled?: boolean;
}

export type SingleType<MixType> = MixType extends (infer Single)[] ? Single : MixType;

export type OnClear = () => void;

export type CustomTagProps = {
  label: DefaultValueType;
  value: DefaultValueType;
  disabled: boolean;
  onClose: (event?: MouseEvent) => void;
  closable: boolean;
};

// ==================================== Generator ====================================
export type GetLabeledValue<FOT extends FlattenOptionsType> = (
  value: RawValueType,
  config: {
    options: FOT;
    prevValue: DefaultValueType;
    labelInValue: boolean;
    optionLabelProp: string;
  },
) => LabelValueType;

export type FilterOptions<OptionsType extends object[]> = (
  searchValue: string,
  options: OptionsType,
  /** Component props, since Select & TreeSelect use different prop name, use any here */
  config: {
    optionFilterProp: string;
    filterOption: boolean | FilterFunc<OptionsType[number]>;
  },
) => OptionsType;

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

export type FlattenOptionsType<OptionsType extends object[] = object[]> = {
  key: Key;
  data: OptionsType[number];
  /** Used for customize data */
  [name: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}[];

export type DropdownObject = {
  menuNode?: VueNode;
  props?: Record<string, any>;
};

export type DropdownRender = (opt?: DropdownObject) => VueNode;
