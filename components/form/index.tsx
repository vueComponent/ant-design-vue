import { App, Plugin } from 'vue';
import Form, {formProps} from './Form';
import FormItem, {formItemProps} from './FormItem';

export type { FormProps } from './Form';
export type { FormItemProps } from './FormItem';

/* istanbul ignore next */
Form.install = function(app: App) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
  return app;
};

export { FormItem, formItemProps, formProps };
export default Form as typeof Form &
  Plugin & {
    readonly Item: typeof Form.Item;
  };
