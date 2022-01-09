/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 *
 * New api:
 * - listHeight
 * - listItemHeight
 * - component
 *
 * Remove deprecated api:
 * - multiple
 * - tags
 * - combobox
 * - firstActiveValue
 * - dropdownMenuStyle
 * - openClassName (Not list in api)
 *
 * Update:
 * - `backfill` only support `combobox` mode
 * - `combobox` mode not support `labelInValue` since it's meaningless
 * - `getInputElement` only support `combobox` mode
 * - `onChange` return OptionData instead of ReactNode
 * - `filterOption` `onChange` `onSelect` accept OptionData instead of ReactNode
 * - `combobox` mode trigger `onChange` will get `undefined` if no `value` match in Option
 * - `combobox` mode not support `optionLabelProp`
 */

import BaseSelect, { baseSelectPropsWithoutPrivate, isMultiple } from './BaseSelect';
import type {
  DisplayValueType,
  RenderNode,
  BaseSelectRef,
  BaseSelectPropsWithoutPrivate,
  BaseSelectProps,
} from './BaseSelect';
import OptionList from './OptionList';
import Option from './Option';
import OptGroup from './OptGroup';
import useOptions from './hooks/useOptions';
import SelectContext from './SelectContext';
import useId from './hooks/useId';
import useRefFunc from './hooks/useRefFunc';
import { fillFieldNames, flattenOptions, injectPropsWithOption } from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { toArray } from './utils/commonUtil';
import useFilterOptions from './hooks/useFilterOptions';
import useCache from './hooks/useCache';
import type { Key } from '../_util/type';
import { defineComponent } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';

const OMIT_DOM_PROPS = ['inputValue'];

export type OnActiveValue = (
  active: RawValueType,
  index: number,
  info?: { source?: 'keyboard' | 'mouse' },
) => void;

export type OnInternalSelect = (value: RawValueType, info: { selected: boolean }) => void;

export type RawValueType = string | number;
export interface LabelInValueType {
  label: any;
  value: RawValueType;
  /** @deprecated `key` is useless since it should always same as `value` */
  key?: Key;
}

export type DraftValueType =
  | RawValueType
  | LabelInValueType
  | DisplayValueType
  | (RawValueType | LabelInValueType | DisplayValueType)[];

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

export interface FieldNames {
  value?: string;
  label?: string;
  options?: string;
}

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  label: any;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, 'children'>[];
}

export type SelectHandler<ValueType = any, OptionType extends BaseOptionType = DefaultOptionType> =
  | ((value: RawValueType | LabelInValueType, option: OptionType) => void)
  | ((value: ValueType, option: OptionType) => void);

export function selectProps<
  ValueType = any,
  OptionType extends BaseOptionType = DefaultOptionType,
>() {
  return {
    ...baseSelectPropsWithoutPrivate(),
    prefixCls: String,
    id: String,

    backfill: { type: Boolean, default: undefined },

    // >>> Field Names
    fieldNames: Object as PropType<FieldNames>,

    // >>> Search
    /** @deprecated Use `searchValue` instead */
    inputValue: String,
    searchValue: String,
    onSearch: Function as PropType<(value: string) => void>,
    autoClearSearchValue: { type: Boolean, default: undefined },

    // >>> Select
    onSelect: Function as PropType<SelectHandler<ValueType, OptionType>>,
    onDeselect: Function as PropType<SelectHandler<ValueType, OptionType>>,

    // >>> Options
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
      type: [Boolean, Function] as PropType<boolean | FilterFunc<OptionType>>,
      default: undefined,
    },
    filterSort: Function as PropType<(optionA: OptionType, optionB: OptionType) => number>,
    optionFilterProp: String,
    optionLabelProp: String,
    children: PropTypes.any,
    options: Array as PropType<OptionType[]>,
    defaultActiveFirstOption: { type: Boolean, default: undefined },
    virtual: { type: Boolean, default: undefined },
    listHeight: Number,
    listItemHeight: Number,

    // >>> Icon
    menuItemSelectedIcon: PropTypes.any,

    mode: String as PropType<'combobox' | 'multiple' | 'tags'>,
    labelInValue: { type: Boolean, default: undefined },
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    onChange: Function as PropType<(value: ValueType, option: OptionType | OptionType[]) => void>,
  };
}

export type SelectProps = Partial<ExtractPropTypes<ReturnType<typeof selectProps>>>;

export default defineComponent({});
