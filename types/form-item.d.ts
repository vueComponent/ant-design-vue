import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** AFormItem Layout Component */
export declare class AFormItem extends AntdVueComponent {
  colon: boolean

  extra: string | VNode

  hasFeedback: boolean

  help: string | VNode

  label: string | VNode

  labelCol: object

  required: boolean

  validateStatus: string

  wrapperCol: object
}
