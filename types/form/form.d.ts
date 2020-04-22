// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { Col } from '../grid/col';
import Vue from 'vue';
import { FormItem } from './form-item';

export interface Field {
  [fieldName: string]: {
    value: any;
    errors?: Array<Error>;
  };
}

export interface FieldValue {
  [fieldName: string]: any;
}
/** dom-scroll-into-view 组件配置参数 */
export type DomScrollIntoViewConfig = {
  /** 是否和左边界对齐 */
  alignWithLeft?: boolean;
  /** 是否和上边界对齐  */
  alignWithTop?: boolean;
  /** 顶部偏移量 */
  offsetTop?: number;
  /** 左侧偏移量 */
  offsetLeft?: number;
  /** 底部偏移量 */
  offsetBottom?: number;
  /** 右侧偏移量 */
  offsetRight?: number;
  /** 是否允许容器水平滚动 */
  allowHorizontalScroll?: boolean;
  /** 当内容可见时是否允许滚动容器 */
  onlyScrollIfNeeded?: boolean;
};

export type ValidateFieldsOptions = {
  /** 所有表单域是否在第一个校验规则失败后停止继续校验 */
  first?: boolean;
  /** 指定哪些表单域在第一个校验规则失败后停止继续校验 */
  firstFields?: string[];
  /** 已经校验过的表单域，在 validateTrigger 再次被触发时是否再次校验 */
  force?: boolean;
  /** 定义 validateFieldsAndScroll 的滚动行为 */
  scroll?: DomScrollIntoViewConfig;
};

declare interface ValidationRule {
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

declare interface FieldDecoratorOptions {
  /**
   * Specify how to get value from event or other onChange arguments
   * @type Function
   */
  getValueFromEvent?: (...args: any[]) => any;

  /**
   * Get the component props according to field value.
   * @type Function
   */
  getValueProps?: (value: any) => any;

  /**
   * You can specify initial value, type, optional value of children node.
   * (Note: Because Form will test equality with === internally, we recommend to use variable as initialValue, instead of literal)
   * @default n/a
   * @type any
   */
  initialValue?: any;

  /**
   * Normalize value to form component
   * @type Function
   */
  normalize?: (value: any, prevValue: any, allValues: any) => any;

  /**
   * Includes validation rules. Please refer to "Validation Rules" part for details.
   * @default n/a
   * @type ValidationRule[]
   */
  rules?: ValidationRule[];

  /**
   * When to collect the value of children node
   * @default 'change'
   * @type string
   */
  trigger?: string;

  /**
   * Whether stop validate on first rule of error for this field.
   * @default false
   * @type boolean
   */
  validateFirst?: boolean;

  /**
   * When to validate the value of children node.
   * @default 'change'
   * @type string | string[]
   */
  validateTrigger?: string | string[];

  /**
   * Props of children node, for example, the prop of Switch is 'checked'.
   * @default 'value'
   * @type string
   */
  valuePropName?: string;

  /**
   * Whether to keep the information of the child node all the time.
   * @default false
   * @type boolean
   */
  preserve?: boolean;
}

export type ValidateCallback = (errors: Error[], values: any) => void;

export interface WrappedFormUtils {
  /**
   * Two-way binding for form, single file template can be bound using the directive v-decorator.
   * @type Function
   */
  getFieldDecorator(id: string, options: FieldDecoratorOptions): any;

  /**
   * Get the error of a field.
   * @type Function (Function(name))
   */
  getFieldError(name: string): object[];

  /**
   * Get the specified fields' error. If you don't specify a parameter, you will get all fields' error.
   * @type Function (Function([names: string[]))
   */
  getFieldsError(names?: string[]): object;

  /**
   * Get the specified fields' values. If you don't specify a parameter, you will get all fields' values.
   * @type Funtion (Function([fieldNames: string[]))
   */
  getFieldsValue(fieldNames?: string[]): { [field: string]: any };

  /**
   * Get the value of a field.
   * @type Function (Function(fieldName: string))
   */
  getFieldValue(fieldName: string): any;

  /**
   * Check whether any of fields is touched by getFieldDecorator's options.trigger event
   * @type Function
   */
  isFieldsTouched(names?: string[]): boolean;

  /**
   * Check whether a field is touched by getFieldDecorator's options.trigger event
   * @type Function ((name: string) => boolean)
   */
  isFieldTouched: Function;

  /**
   * Check if the specified field is being validated.
   * @type Function (Function(name))
   */
  isFieldValidating(name: string): boolean;

  /**
   * Reset the specified fields' value(to initialValue) and status.
   * If you don't specify a parameter, all the fields will be reset.
   * @type Function (Function([names: string[]]))
   */
  resetFields(names?: string[]): void;

  /**
   * Set value and error state of fields
   * @type Function
   */
  setFields(field: Field): void;

  /**
   * Set the value of a field.
   * @type Function
   */
  setFieldsValue(fieldValue: FieldValue): void;

  /**
   * Validate the specified fields and get theirs values and errors.
   * If you don't specify the parameter of fieldNames, you will validate all fields.
   * @type Function
   */
  validateFields(
    fieldNames: Array<string>,
    options: ValidateFieldsOptions,
    callback: ValidateCallback,
  ): void;
  validateFields(options: ValidateFieldsOptions, callback: ValidateCallback): void;
  validateFields(fieldNames: Array<string>, callback: ValidateCallback): void;
  validateFields(fieldNames: Array<string>, options: ValidateFieldsOptions): void;
  validateFields(fieldNames: Array<string>): void;
  validateFields(callback: ValidateCallback): void;
  validateFields(options: ValidateFieldsOptions): void;
  validateFields(): void;

  /**
   * This function is similar to validateFields, but after validation, if the target field is not in visible area of form,
   * form will be automatically scrolled to the target field area.
   * @type Function
   */
  validateFieldsAndScroll(
    fieldNames: Array<string>,
    options: ValidateFieldsOptions,
    callback: ValidateCallback,
  ): void;
  validateFieldsAndScroll(options: ValidateFieldsOptions, callback: ValidateCallback): void;
  validateFieldsAndScroll(fieldNames: Array<string>, callback: ValidateCallback): void;
  validateFieldsAndScroll(fieldNames: Array<string>, options: ValidateFieldsOptions): void;
  validateFieldsAndScroll(fieldNames: Array<string>): void;
  validateFieldsAndScroll(callback: ValidateCallback): void;
  validateFieldsAndScroll(options: ValidateFieldsOptions): void;
  validateFieldsAndScroll(): void;
}

export interface IformCreateOption {
  /**
   * Set prefix for the form fields id
   * @type string
   */
  name?: string;

  /**
   * Only supports the use of Form.create({})(CustomizedForm). declare props on form(like vue props)
   * @type object
   */
  props?: object;

  /**
   * Convert props to field value(e.g. reading the values from Redux store). And you must mark returned fields with Form.createFormField.
   * If you use $form.createForm to create a collector, you can map any data to the Field without being bound by the parent component.
   * @type Function
   */
  mapPropsToFields?: Function;

  /**
   * Default validate message. And its format is similar with newMessages's returned value
   * @type any
   */
  validateMessages?: any;

  /**
   * Specify a function that will be called when the value a Form.Item gets changed.
   * Usage example: saving the field's value to Redux store.
   * @type Function (Function(props, fields))
   */
  onFieldsChange?: (props: any, fields: any) => any;

  /**
   * A handler while value of any field is changed
   * @type Function
   */
  onValuesChange?: (props: any, fields: any) => void;
}

export declare class Form extends AntdComponent {
  static Item: typeof FormItem;
  static create: (options: IformCreateOption) => (WrapedComponent: any) => any;

  /**
   * Decorated by Form.create() will be automatically set this.form property, so just pass to form.
   * If you use the template syntax, you can use this.$form.createForm(this, options)
   * @default n/a
   * @type WrappedFormUtils
   */
  form: WrappedFormUtils;

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
   * Automate Form.create, Recommended for use under the template component, and cannot be used with Form.create().
   * You should use $form.createForm to instead it after 1.1.9.
   * @type Function
   * @deprecated after 1.1.9
   */
  autoFormCreate: (form: any) => any;

  /**
   * The options corresponding to Form.create(options). You should use $form.createForm to instead it after 1.1.9.
   * @type object
   * @deprecated after 1.1.9
   */
  options: object;

  createForm(context: Vue, options?: IformCreateOption): WrappedFormUtils;

  /**
   * Convert props to field value
   * @param field
   */
  createFormField(field: any): any;
  colon: boolean;
  labelAlign: 'left' | 'right';
  selfUpdate: boolean;
}

declare module 'vue/types/vue' {
  interface Vue {
    $form: Form;
  }
}
