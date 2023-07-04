import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';

export type CheckboxValueType = string | number | boolean;
export interface CheckboxOptionType {
  label?: VueNode;
  value: CheckboxValueType;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}

export interface CheckboxChangeEventTarget extends CheckboxProps {
  checked: boolean;
}

export const abstractCheckboxGroupProps = () => {
  return {
    name: String,
    prefixCls: String,
    options: {
      type: Array as PropType<Array<CheckboxOptionType | string | number>>,
      default: () => [] as Array<CheckboxOptionType | string | number>,
    },
    disabled: Boolean,
    id: String,
  };
};

export const checkboxGroupProps = () => {
  return {
    ...abstractCheckboxGroupProps(),
    defaultValue: { type: Array as PropType<Array<CheckboxValueType>> },
    value: { type: Array as PropType<Array<CheckboxValueType>> },
    onChange: { type: Function as PropType<(checkedValue: Array<CheckboxValueType>) => void> },
    'onUpdate:value': {
      type: Function as PropType<(checkedValue: Array<CheckboxValueType>) => void>,
    },
  };
};

export type CheckboxGroupProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxGroupProps>>>;

export const abstractCheckboxProps = () => {
  return {
    prefixCls: String,
    defaultChecked: { type: Boolean, default: undefined },
    checked: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    isGroup: { type: Boolean, default: undefined },
    value: PropTypes.any,
    name: String,
    id: String,
    indeterminate: { type: Boolean, default: undefined },
    type: { type: String, default: 'checkbox' },
    autofocus: { type: Boolean, default: undefined },
    onChange: Function as PropType<(e: CheckboxChangeEvent) => void>,
    'onUpdate:checked': Function as PropType<(checked: boolean) => void>,
    onClick: Function as PropType<MouseEventHandler>,
    skipGroup: { type: Boolean, default: false },
  };
};

export const checkboxProps = () => {
  return {
    ...abstractCheckboxProps(),
    indeterminate: { type: Boolean, default: false },
  };
};

export type CheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxProps>>>;

export type CheckboxGroupContext = {
  cancelValue: (id: Symbol) => void;
  registerValue: (id: Symbol, value: string) => void;
  toggleOption: (option: CheckboxOptionType) => void;
  name: Ref<string>;
  disabled: Ref<boolean>;
  mergedValue: Ref<CheckboxValueType[]>;
};
export const CheckboxGroupContextKey: InjectionKey<CheckboxGroupContext> =
  Symbol('CheckboxGroupContext');
