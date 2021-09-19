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

import type { OptionsType as SelectOptionsType } from './interface';
import SelectOptionList from './OptionList';
import Option from './Option';
import OptGroup from './OptGroup';
import { convertChildrenToData as convertSelectChildrenToData } from './utils/legacyUtil';
import {
  getLabeledValue as getSelectLabeledValue,
  filterOptions as selectDefaultFilterOptions,
  isValueDisabled as isSelectValueDisabled,
  findValueOption as findSelectValueOption,
  flattenOptions,
  fillOptionsWithMissingValue,
} from './utils/valueUtil';
import type { SelectProps } from './generate';
import generateSelector, { selectBaseProps } from './generate';
import type { DefaultValueType } from './interface/generator';
import warningProps from './utils/warningPropsUtil';
import { defineComponent, ref } from 'vue';

const RefSelect = generateSelector<SelectOptionsType[number]>({
  prefixCls: 'rc-select',
  components: {
    optionList: SelectOptionList as any,
  },
  convertChildrenToData: convertSelectChildrenToData,
  flattenOptions,
  getLabeledValue: getSelectLabeledValue,
  filterOptions: selectDefaultFilterOptions,
  isValueDisabled: isSelectValueDisabled,
  findValueOption: findSelectValueOption,
  warningProps,
  fillOptionsWithMissingValue,
});

export type ExportedSelectProps<T extends DefaultValueType = DefaultValueType> = SelectProps<
  SelectOptionsType[number],
  T
>;

export function selectProps<T>() {
  return selectBaseProps<SelectOptionsType[number], T>();
}

const Select = defineComponent({
  name: 'Select',
  inheritAttrs: false,
  Option,
  OptGroup,
  props: RefSelect.props,
  setup(props, { attrs, expose, slots }) {
    const selectRef = ref();
    expose({
      focus: () => {
        selectRef.value?.focus();
      },
      blur: () => {
        selectRef.value?.blur();
      },
    });
    return () => {
      return (
        <RefSelect
          ref={selectRef}
          {...(props as any)}
          {...attrs}
          v-slots={slots}
          children={slots.default?.() || []}
        />
      );
    };
  },
});
export default Select;
