import OptionList from './OptionList';
import TreeNode from './TreeNode';
import { formatStrategyValues, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './utils/strategyUtil';
import type { CheckedStrategy } from './utils/strategyUtil';
import TreeSelectContext from './TreeSelectContext';
import type { TreeSelectContextProps } from './TreeSelectContext';
import LegacyContext from './LegacyContext';
import useTreeData from './hooks/useTreeData';
import { toArray, fillFieldNames, isNil } from './utils/valueUtil';
import useCache from './hooks/useCache';
import useRefFunc from './hooks/useRefFunc';
import useDataEntities from './hooks/useDataEntities';
import { fillAdditionalInfo, fillLegacyProps } from './utils/legacyUtil';
import useCheckedKeys from './hooks/useCheckedKeys';
import useFilterTreeData from './hooks/useFilterTreeData';
import warningProps from './utils/warningPropsUtil';
import type { Key } from './interface';
import { baseSelectPropsWithoutPrivate } from '../vc-select/BaseSelect';
import { defineComponent } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import type { SelectProps } from '../vc-select';

export type OnInternalSelect = (value: RawValueType, info: { selected: boolean }) => void;

export type RawValueType = string | number;

export interface LabeledValueType {
  key?: Key;
  value?: RawValueType;
  label?: any;
  /** Only works on `treeCheckStrictly` */
  halfChecked?: boolean;
}

export type SelectSource = 'option' | 'selection' | 'input' | 'clear';

export type DraftValueType = RawValueType | LabeledValueType | (RawValueType | LabeledValueType)[];

/** @deprecated This is only used for legacy compatible. Not works on new code. */
export interface LegacyCheckedNode {
  pos: string;
  node: any;
  children?: LegacyCheckedNode[];
}

export interface ChangeEventExtra {
  /** @deprecated Please save prev value by control logic instead */
  preValue: LabeledValueType[];
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

export interface InternalFieldName extends Omit<FieldNames, 'label'> {
  _title: string[];
}

export interface SimpleModeConfig {
  id?: Key;
  pId?: Key;
  rootPId?: Key;
}

export interface BaseOptionType {
  disabled?: boolean;
  checkable?: boolean;
  disableCheckbox?: boolean;
  children?: BaseOptionType[];
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  value?: RawValueType;
  title?: any;
  label?: any;
  key?: Key;
  children?: DefaultOptionType[];
}

export interface LegacyDataNode extends DefaultOptionType {
  props: any;
}

export function treeSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType = DefaultOptionType,
>() {
  return {
    ...omit(baseSelectPropsWithoutPrivate(), ['mode']),

    prefixCls: String,
    id: String,
    value: { type: [String, Number, Object, Array] as PropType<ValueType> },
    defaultValue: { type: [String, Number, Object, Array] as PropType<ValueType> },
    onChange: {
      type: Function as PropType<
        (value: ValueType, labelList: any[], extra: ChangeEventExtra) => void
      >,
    },
    searchValue: String,
    /** @deprecated Use `searchValue` instead */
    inputValue: String,
    onSearch: { type: Function as PropType<(value: string) => void> },
    autoClearSearchValue: { type: Boolean, default: undefined },

    filterTreeNode: {
      type: [Boolean, Function] as PropType<
        boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)
      >,
      default: undefined,
    },
    treeNodeFilterProp: String,

    // >>> Select
    onSelect: Function as PropType<SelectProps['onSelect']>,
    onDeselect: Function as PropType<SelectProps['onDeselect']>,

    showCheckedStrategy: { type: String as PropType<CheckedStrategy> },
    treeNodeLabelProp: String,

    fieldNames: { type: Object as PropType<FieldNames> },

    // >>> Mode
    multiple: { type: Boolean, default: undefined },
    treeCheckable: { type: Boolean, default: undefined },
    treeCheckStrictly: { type: Boolean, default: undefined },
    labelInValue: { type: Boolean, default: undefined },

    // >>> Data
    treeData: { type: Array as PropType<OptionType[]> },
    treeDataSimpleMode: {
      type: [Boolean, Object] as PropType<boolean | SimpleModeConfig>,
      default: undefined,
    },
    treeLoadedKeys: { type: Array as PropType<Key[]> },
    onTreeLoad: { type: Function as PropType<(loadedKeys: Key[]) => void> },

    // >>> Options
    virtual: { type: Boolean, default: undefined },
    listHeight: Number,
    listItemHeight: Number,
    onDropdownVisibleChange: { type: Function as PropType<(open: boolean) => void> },

    // >>> Tree
    treeLine: { type: Boolean, default: undefined },
    treeIcon: PropTypes.any,
    showTreeIcon: { type: Boolean, default: undefined },
    switcherIcon: PropTypes.any,
    treeMotion: PropTypes.any,

    // showArrow: { type: Boolean, default: undefined },
    // showSearch: { type: Boolean, default: undefined },
    // open: { type: Boolean, default: undefined },
    // defaultOpen: { type: Boolean, default: undefined },

    // disabled: { type: Boolean, default: undefined },

    // placeholder: PropTypes.any,

    // maxTagPlaceholder: { type: Function as PropType<(omittedValues: LabelValueType[]) => any> },

    // loadData: { type: Function as PropType<(dataNode: LegacyDataNode) => Promise<unknown>> },

    // treeExpandedKeys: { type: Array as PropType<Key[]> },
    // treeDefaultExpandedKeys: { type: Array as PropType<Key[]> },

    // treeDefaultExpandAll: { type: Boolean, default: undefined },

    // children: Array,

    // dropdownPopupAlign: PropTypes.any,

    // // Event

    // onTreeExpand: { type: Function as PropType<(expandedKeys: Key[]) => void> },
  };
}

export type TreeSelectProps = Partial<ExtractPropTypes<ReturnType<typeof treeSelectProps>>>;

function isRawValue(value: RawValueType | LabeledValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

export default defineComponent({
  name: 'TreeSelect',
  inheritAttrs: false,
  props: treeSelectProps(),
  setup() {
    return () => {
      return null;
    };
  },
});
