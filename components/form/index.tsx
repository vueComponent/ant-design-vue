import { App, Plugin } from 'vue';
import Form from './Form';

export { FormProps } from './Form';

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
