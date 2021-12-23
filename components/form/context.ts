import type { InjectionKey, ComputedRef } from 'vue';
import { inject, provide, computed } from 'vue';
import type { ColProps } from '../grid';
import type { RequiredMark, ValidationRule } from './Form';
import type { ValidateStatus, FieldExpose } from './FormItem';
import type { FormLabelAlign, ValidateMessages } from './interface';
import { defaultValidateMessages } from './utils/messages';

export interface FormContextProps {
  model?: ComputedRef<any>;
  vertical: ComputedRef<boolean>;
  name?: ComputedRef<string>;
  colon?: ComputedRef<boolean>;
  labelAlign?: ComputedRef<FormLabelAlign>;
  labelCol?: ComputedRef<ColProps>;
  wrapperCol?: ComputedRef<ColProps>;
  requiredMark?: ComputedRef<RequiredMark>;
  //itemRef: (name: (string | number)[]) => (node: React.ReactElement) => void;
  addField: (eventKey: string, field: FieldExpose) => void;
  removeField: (eventKey: string) => void;
  validateTrigger?: ComputedRef<string | string[]>;
  rules?: ComputedRef<{ [k: string]: ValidationRule[] | ValidationRule }>;
  onValidate: (
    name: string | number | Array<string | number>,
    status: boolean,
    errors: string[] | null,
  ) => void;
  validateMessages: ComputedRef<ValidateMessages>;
}

export const FormContextKey: InjectionKey<FormContextProps> = Symbol('formContextKey');

export const useProvideForm = (state: FormContextProps) => {
  provide(FormContextKey, state);
};

export const useInjectForm = () => {
  return inject(FormContextKey, {
    labelAlign: computed(() => 'right' as FormLabelAlign),
    vertical: computed(() => false),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addField: (_eventKey: string, _field: FieldExpose) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeField: (_eventKey: string) => {},
    model: computed(() => undefined),
    rules: computed(() => undefined),
    requiredMark: computed(() => false),
    onValidate: () => {},
    validateMessages: computed(() => defaultValidateMessages),
  });
};

/** Used for ErrorList only */
export interface FormItemPrefixContextProps {
  prefixCls: ComputedRef<string>;
  status?: ComputedRef<ValidateStatus>;
}

export const FormItemPrefixContextKey: InjectionKey<FormItemPrefixContextProps> = Symbol(
  'formItemPrefixContextKey',
);

export const useProvideFormItemPrefix = (state: FormItemPrefixContextProps) => {
  provide(FormItemPrefixContextKey, state);
};

export const useInjectFormItemPrefix = () => {
  return inject(FormItemPrefixContextKey, {
    prefixCls: computed(() => ''),
  });
};
