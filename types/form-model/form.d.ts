// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { Col } from '../grid/col';
import Vue from 'vue';
import { FormModelItem } from './form-item';

declare interface ValidationRule {
  trigger?: string;
  /**
   * validation error message
   * @type string
   */
  message?: string;

  /**
   * built-in validation type, available options: https://github.com/yiminghe/async-validator#type
   * @default 'string'
   * @type string
   */
  type?: string;

  /**
   * indicates whether field is required
   * @default false
   * @type boolean
   */
  required?: boolean;

  /**
   * treat required fields that only contain whitespace as errors
   * @default false
   * @type boolean
   */
  whitespace?: boolean;

  /**
   * validate the exact length of a field
   * @type number
   */
  len?: number;

  /**
   * validate the min length of a field
   * @type number
   */
  min?: number;

  /**
   * validate the max length of a field
   * @type number
   */
  max?: number;

  /**
   * validate the value from a list of possible values
   * @type string | string[]
   */
  enum?: string | string[];

  /**
   * validate from a regular expression
   * @type boolean
   */
  pattern?: RegExp;

  /**
   * transform a value before validation
   * @type Function
   */
  transform?: (value: any) => any;

  /**
   * custom validate function (Note: callback must be called)
   * @type Function
   */
  validator?: (rule: any, value: any, callback: Function) => any;
}

export declare class FormModel extends AntdComponent {
  static Item: typeof FormModelItem;

  /**
   * Hide required mark of all form items
   * @default false
   * @type boolean
   */
  hideRequiredMark: boolean;

  /**
   * The layout of label. You can set span offset to something like {span: 3, offset: 12} or sm: {span: 3, offset: 12} same as with <Col>
   * @type Col
   */
  labelCol: Col;

  /**
   * Define form layout
   * @default 'horizontal'
   * @type string
   */
  layout: 'horizontal' | 'inline' | 'vertical';

  /**
   * The layout for input controls, same as labelCol
   * @type Col
   */
  wrapperCol: Col;

  /**
   * change default props colon value of Form.Item (only effective when prop layout is horizontal)
   * @type boolean
   * @default true
   */
  colon: boolean;

  /**
   * text align of label of all items
   * @type 'left' | 'right'
   * @default 'left'
   */
  labelAlign: 'left' | 'right';

  /**
   * data of form component
   * @type object
   */
  model: object;

  /**
   * validation rules of form
   * @type object
   */
  rules: object;

  /**
   * Default validate message. And its format is similar with newMessages's returned value
   * @type any
   */
  validateMessages?: any;

  /**
   * whether to trigger validation when the rules prop is changed
   * @type Boolean
   * @default true
   */
  validateOnRuleChange: boolean;

  /**
   * validate the whole form. Takes a callback as a param. After validation,
   * the callback will be executed with two params: a boolean indicating if the validation has passed,
   * and an object containing all fields that fail the validation. Returns a promise if callback is omitted
   * @type Function
   */
  validate: (callback?: (boolean: Boolean, object: Object) => void) => void | Promise<any>;

  /**
   * validate one or several form items
   * @type Function
   */
  validateField: (props: string[] | string, callback: (errorMessage: string) => void) => void;

  /**
   * reset all the fields and remove validation result
   */
  resetFields: () => void;

  /**
   * clear validation message for certain fields.
   * The parameter is prop name or an array of prop names of the form items whose validation messages will be removed.
   * When omitted, all fields' validation messages will be cleared
   * @type string[] | string
   */
  clearValidate: (props: string[] | string) => void;
}
