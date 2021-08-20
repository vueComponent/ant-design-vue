import type { ExtractPropTypes, PropType } from 'vue';
import type { DataNode } from '../tree';
import PropTypes from '../_util/vue-types';
import type { FlattenDataNode, RawValueType } from './interface';

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

class Helper<T> {
  Return = optionListProps<T>();
}
type FuncReturnType<T> = Helper<T>['Return'];

export type OptionListProps = Partial<ExtractPropTypes<FuncReturnType<DataNode>>>;
