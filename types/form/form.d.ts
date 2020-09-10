// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { Col } from '../grid/col';
import { FormItem } from './form-item';

export declare type InternalNamePath = (string | number)[];
export declare type NamePath = string | number | InternalNamePath;
export interface ValidateErrorEntity {
  values: object;
  errorFields: {
    name: InternalNamePath;
    errors: string[];
  }[];
  outOfDate: boolean;
}

export declare type ValidateFields = (nameList?: NamePath[]) => Promise<object>;

declare type ValidateMessage = string | (() => string);
export interface ValidateMessages {
  default?: ValidateMessage;
  required?: ValidateMessage;
  enum?: ValidateMessage;
  whitespace?: ValidateMessage;
  date?: {
    format?: ValidateMessage;
    parse?: ValidateMessage;
    invalid?: ValidateMessage;
  };
  types?: {
    string?: ValidateMessage;
    method?: ValidateMessage;
    array?: ValidateMessage;
    object?: ValidateMessage;
    number?: ValidateMessage;
    date?: ValidateMessage;
    boolean?: ValidateMessage;
    integer?: ValidateMessage;
    float?: ValidateMessage;
    regexp?: ValidateMessage;
    email?: ValidateMessage;
    url?: ValidateMessage;
    hex?: ValidateMessage;
  };
  string?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  number?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  array?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  pattern?: {
    mismatch?: ValidateMessage;
  };
}
export declare type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email';

declare type Validator = (
  rule: any,
  value: any,
  callback: (error?: string) => void,
) => Promise<void> | void;

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
  validator?: Validator;
}

export declare class Form extends AntdComponent {
  static Item: typeof FormItem;
  $props: AntdProps & {
    /**
     * Hide required mark of all form items
     * @default false
     * @type boolean
     */
    hideRequiredMark?: boolean;

    /**
     * The layout of label. You can set span offset to something like {span: 3, offset: 12} or sm: {span: 3, offset: 12} same as with <Col>
     * @type Col
     */
    labelCol?: Col;

    /**
     * Define form layout
     * @default 'horizontal'
     * @type string
     */
    layout?: 'horizontal' | 'inline' | 'vertical';

    /**
     * The layout for input controls, same as labelCol
     * @type Col
     */
    wrapperCol?: Col;

    /**
     * change default props colon value of Form.Item (only effective when prop layout is horizontal)
     * @type boolean
     * @default true
     */
    colon?: boolean;

    /**
     * text align of label of all items
     * @type 'left' | 'right'
     * @default 'left'
     */
    labelAlign?: 'left' | 'right';

    /**
     * data of form component
     * @type object
     */
    model?: object;

    /**
     * validation rules of form
     * @type object
     */
    rules?: object;

    /**
     * Default validate message. And its format is similar with newMessages's returned value
     * @type any
     */
    validateMessages?: ValidateMessages;

    /**
     * whether to trigger validation when the rules prop is changed
     * @type Boolean
     * @default true
     */
    validateOnRuleChange?: boolean;

    scrollToFirstError?: boolean;

    validateTrigger?: string | string[] | false;
    /**
     * Defines a function will be called if form data validation.
     * @param e
     */
    onSubmit?: (e?: Event) => void;
    /**
     * Trigger after submitting the form and verifying data successfully
     * @param values
     */
    onFinish?: (values?: object) => void;
    /**
     * Trigger after submitting the form and verifying data failed
     * @param errorInfo
     */
    onFinishFailed?: (errorInfo?: ValidateErrorEntity) => void;
  };
  /**
   * clear validation message for certain fields.
   * The parameter is prop name or an array of prop names of the form items whose validation messages will be removed.
   * When omitted, all fields' validation messages will be cleared
   * @type string[] | string
   */
  clearValidate: (name: string[] | string) => void;
  /**
   * reset all the fields and remove validation result
   */
  resetFields: (fields?: NamePath[]) => void;
  validateFields: ValidateFields;
  validate: ValidateFields;
  scrollToField: (name: NamePath, options?: ScrollOptions) => void;
}
