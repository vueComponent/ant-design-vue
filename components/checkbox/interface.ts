import type { ExtractPropTypes, InjectionKey, Ref } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';
import { booleanType, functionType, stringType, arrayType } from '../_util/type';

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
    options: arrayType<Array<CheckboxOptionType | string | number>>(
      [] as Array<CheckboxOptionType | string | number>,
    ),
    disabled: Boolean,
    id: String,
  };
};

export const checkboxGroupProps = () => {
  return {
    ...abstractCheckboxGroupProps(),
    defaultValue: arrayType<Array<CheckboxValueType>>(),
    value: arrayType<Array<CheckboxValueType>>(),
    onChange: functionType<(checkedValue: Array<CheckboxValueType>) => void>(),
    'onUpdate:value': functionType<(checkedValue: Array<CheckboxValueType>) => void>(),
  };
};

export type CheckboxGroupProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxGroupProps>>>;

export const abstractCheckboxProps = () => {
  return {
    prefixCls: String,
    defaultChecked: booleanType(),
    checked: booleanType(),
    disabled: booleanType(),
    isGroup: booleanType(),
    value: PropTypes.any,
    name: String,
    id: String,
    indeterminate: booleanType(),
    type: stringType('checkbox'),
    autofocus: booleanType(),
    onChange: functionType<(e: CheckboxChangeEvent) => void>(),
    'onUpdate:checked': functionType<(checked: boolean) => void>(),
    onClick: functionType<MouseEventHandler>(),
    skipGroup: booleanType(false),
  };
};

export const checkboxProps = () => {
  return {
    ...abstractCheckboxProps(),
    indeterminate: booleanType(false),
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
