import { App } from 'vue';
import Form from './Form';

export { FormProps } from './Form';

/* istanbul ignore next */
Form.install = function(app: App) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
  return app;
};

export default Form as typeof Form & {
  readonly Item: typeof Form.Item;
};
