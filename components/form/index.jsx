import Vue from 'vue'
import Form from './Form'
import ref from 'vue-ref'

Vue.use(ref, { name: 'ant-ref' })

export { FormProps, FormCreateOption, ValidationRule } from './Form'
export { FormItemProps } from './FormItem'

/* istanbul ignore next */
Form.install = function (Vue) {
  Vue.component(Form.name, Form)
  Vue.component(Form.Item.name, Form.Item)
}

export default Form
