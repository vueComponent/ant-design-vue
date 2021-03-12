import { App, Plugin } from 'vue';
import Form from './Form';

export { FormProps, formProps } from './Form';
export { FormItemProps, formItemProps } from './FormItem';

/* istanbul ignore next */
Form.install = function(app: App) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
  return app;
};

export default Form as typeof Form &
  Plugin & {
    readonly Item: typeof Form.Item;
  };
