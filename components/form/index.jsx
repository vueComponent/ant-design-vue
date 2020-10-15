import Form from './Form';

export { FormProps } from './Form';

/* istanbul ignore next */
Form.install = function(app) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
  return app;
};

export default Form;
