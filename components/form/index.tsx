import type { App, Plugin } from 'vue';
import Form, { formProps } from './Form';
import FormItem, { formItemProps } from './FormItem';
import useForm from './useForm';

export type { FormProps } from './Form';
export type { FormItemProps } from './FormItem';

/* istanbul ignore next */
Form.install = function (app: App) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
  return app;
};

export { FormItem, formItemProps, formProps, useForm };

export default Form as typeof Form &
  Plugin & {
    readonly Item: typeof Form.Item;
    readonly useForm: typeof useForm;
  };
