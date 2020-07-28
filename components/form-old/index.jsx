import Vue from 'vue';
import Form from './Form';
import ref from 'vue-ref';
import FormDecoratorDirective from '../_util/FormDecoratorDirective';

Vue.use(ref, { name: 'ant-ref' });
Vue.use(FormDecoratorDirective);
Vue.prototype.$form = Form;

export { FormProps, FormCreateOption, ValidationRule } from './Form';
export { FormItemProps } from './FormItem';

/* istanbul ignore next */
Form.install = function(Vue) {
  Vue.component(Form.name, Form);
  Vue.component(Form.Item.name, Form.Item);
  Vue.prototype.$form = Form;
};

export default Form;
