import type { ExtractPropTypes, PropType } from 'vue';
import type {
  DataNode,
  ChangeEventExtra,
  DefaultValueType,
  FieldNames,
  FlattenDataNode,
  LabelValueType,
  LegacyDataNode,
  RawValueType,
  SimpleModeConfig,
} from './interface';
import { selectBaseProps } from '../vc-select';
import type { FilterFunc } from '../vc-select/interface/generator';
import omit from '../_util/omit';
import type { Key } from '../_util/type';
import PropTypes from '../_util/vue-types';
import type { CheckedStrategy } from './utils/strategyUtil';

export function optionListProps<OptionsType>() {
  return {
    prefixCls: String,
    id: String,
    options: { type: Array as PropType<OptionsType[]> },
    flattenOptions: { type: Array as PropType<FlattenDataNode[]> },
    height: Number,
    itemHeight: Number,
    virtual: { type: Boolean, default: undefined },
    values: { type: Set as PropType<Set<RawValueType>> },
    multiple: { type: Boolean, default: undefined },
    open: { type: Boolean, default: undefined },
    defaultActiveFirstOption: { type: Boolean, default: undefined },
    notFoundContent: PropTypes.any,
    menuItemSelectedIcon: PropTypes.any,
    childrenAsData: { type: Boolean, default: undefined },
    searchValue: String,

    onSelect: {
      type: Function as PropType<(value: RawValueType, option: { selected: boolean }) => void>,
    },
    onToggleOpen: { type: Function as PropType<(open?: boolean) => void> },
    /** Tell Select that some value is now active to make accessibility work */
    onActiveValue: { type: Function as PropType<(value: RawValueType, index: number) => void> },
    onScroll: { type: Function as PropType<(e: UIEvent) => void> },

    onMouseenter: { type: Function as PropType<() => void> },
  };
}

export function treeSelectProps<ValueType = DefaultValueType>() {
  const selectProps = omit(selectBaseProps<DataNode, ValueType>(), [
    'onChange',
    'mode',
    'menuItemSelectedIcon',
    'dropdownAlign',
    'backfill',
    'getInputElement',
    'optionLabelProp',
    'tokenSeparators',
    'filterOption',
  ]);
  return {
    ...selectProps,

    multiple: { type: Boolean, default: undefined },
    showArrow: { type: Boolean, default: undefined },
    showSearch: { type: Boolean, default: undefined },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    value: { type: [String, Number, Object, Array] as PropType<ValueType> },
    defaultValue: { type: [String, Number, Object, Array] as PropType<ValueType> },
    disabled: { type: Boolean, default: undefined },

    placeholder: PropTypes.any,
    /** @deprecated Use `searchValue` instead */
    inputValue: String,
    searchValue: String,
    autoClearSearchValue: { type: Boolean, default: undefined },

    maxTagPlaceholder: { type: Function as PropType<(omittedValues: LabelValueType[]) => any> },

    fieldNames: { type: Object as PropType<FieldNames> },
    loadData: { type: Function as PropType<(dataNode: LegacyDataNode) => Promise<unknown>> },
    treeNodeFilterProp: String,
    treeNodeLabelProp: String,
    treeDataSimpleMode: {
      type: [Boolean, Object] as PropType<boolean | SimpleModeConfig>,
      default: undefined,
    },
    treeExpandedKeys: { type: Array as PropType<Key[]> },
    treeDefaultExpandedKeys: { type: Array as PropType<Key[]> },
    treeLoadedKeys: { type: Array as PropType<Key[]> },
    treeCheckable: { type: Boolean, default: undefined },
    treeCheckStrictly: { type: Boolean, default: undefined },
    showCheckedStrategy: { type: String as PropType<CheckedStrategy> },
    treeDefaultExpandAll: { type: Boolean, default: undefined },
    treeData: { type: Array as PropType<DataNode[]> },
    treeLine: { type: Boolean, default: undefined },
    treeIcon: PropTypes.any,
    showTreeIcon: { type: Boolean, default: undefined },
    switcherIcon: PropTypes.any,
    treeMotion: PropTypes.any,
    children: Array,

    filterTreeNode: {
      type: [Boolean, Function] as PropType<boolean | FilterFunc<LegacyDataNode>>,
      default: undefined,
    },
    dropdownPopupAlign: PropTypes.any,

    // Event
    onSearch: { type: Function as PropType<(value: string) => void> },
    onChange: {
      type: Function as PropType<
        (value: ValueType, labelList: any[], extra: ChangeEventExtra) => void
      >,
    },
    onTreeExpand: { type: Function as PropType<(expandedKeys: Key[]) => void> },
    onTreeLoad: { type: Function as PropType<(loadedKeys: Key[]) => void> },
    onDropdownVisibleChange: { type: Function as PropType<(open: boolean) => void> },

    // Legacy
    /** `searchPlaceholder` has been removed since search box has been merged into input box */
    searchPlaceholder: PropTypes.any,

    /** @private This is not standard API since we only used in `rc-cascader`. Do not use in your production */
    labelRender: { type: Function as PropType<(entity: FlattenDataNode) => any> },
  };
}

class Helper<T> {
  ReturnOptionListProps = optionListProps<T>();
  ReturnTreeSelectProps = treeSelectProps<T>();
}

export type OptionListProps = Partial<ExtractPropTypes<Helper<DataNode>['ReturnOptionListProps']>>;

export type TreeSelectProps<T = DefaultValueType> = Partial<
  ExtractPropTypes<Helper<T>['ReturnTreeSelectProps']>
>;
