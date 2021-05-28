import { inject, InjectionKey, provide, ComputedRef, computed } from 'vue';
import { ColProps } from '../grid';
import { RequiredMark } from './Form';
import { ValidateStatus } from './FormItem';
import { FormLabelAlign } from './interface';

export interface FormContextProps {
  vertical: ComputedRef<boolean>;
  name?: ComputedRef<string>;
  colon?: ComputedRef<boolean>;
  labelAlign?: ComputedRef<FormLabelAlign>;
  labelCol?: ComputedRef<ColProps>;
  wrapperCol?: ComputedRef<ColProps>;
  requiredMark?: ComputedRef<RequiredMark>;
  //itemRef: (name: (string | number)[]) => (node: React.ReactElement) => void;
}

export const FormContextKey: InjectionKey<FormContextProps> = Symbol('formContextKey');

export const useProvideForm = (state: FormContextProps) => {
  provide(FormContextKey, state);
};

export const useInjectForm = () => {
  return inject(FormContextKey, {
    labelAlign: computed(() => 'right' as FormLabelAlign),
    vertical: computed(() => false),
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
