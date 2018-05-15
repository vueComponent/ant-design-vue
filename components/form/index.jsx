import Vue from 'vue'
import Form from './Form'
import antRefDirective from '../_util/antRefDirective'

Vue.use(antRefDirective)

export { FormProps, FormComponentProps, FormCreateOption, ValidateCallback, ValidationRule } from './Form'
export { FormItemProps } from './FormItem'

export default Form
