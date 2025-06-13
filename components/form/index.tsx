import type { App, Plugin } from 'vue';
import Form, { formProps } from './Form';
import AFormItem, { formItemProps } from './FormItem';
import useForm from './useForm';
import AFormItemRest, { useInjectFormItemContext } from './FormItemContext';
export type { Rule, RuleObject } from './interface';

export type { FormProps, FormInstance } from './Form';
export type { FormItemProps, FormItemInstance } from './FormItem';

Form.useInjectFormItemContext = useInjectFormItemContext;
Form.ItemRest = AFormItemRest;
/* istanbul ignore next */
Form.install = function (app: App) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
  app.component(AFormItemRest.name, AFormItemRest);
  return app;
};

export { AFormItem, formItemProps, formProps, AFormItemRest, useForm, useInjectFormItemContext };

export default Form as typeof Form &
  Plugin & {
    readonly Item: typeof Form.Item;
    readonly ItemRest: typeof AFormItemRest;
    readonly useForm: typeof useForm;
    readonly useInjectFormItemContext: typeof useInjectFormItemContext;
  };
