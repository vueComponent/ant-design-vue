import Form from './Form';

export { FormProps, ValidationRule } from './Form';
export { FormItemProps } from './FormItem';

/* istanbul ignore next */
Form.install = function(app) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
};

export default Form;
