import type { VueNode } from '../_util/type';

export type FormLabelAlign = 'left' | 'right';

export type InternalNamePath = (string | number)[];
export type NamePath = string | number | InternalNamePath;

export type StoreValue = any;
export interface Store {
  [name: string]: StoreValue;
}

export interface Meta {
  touched: boolean;
  validating: boolean;
  errors: string[];
  name: InternalNamePath;
}

export interface InternalFieldData extends Meta {
  value: StoreValue;
}

/**
 * Used by `setFields` config
 */
export interface FieldData extends Partial<Omit<InternalFieldData, 'name'>> {
  name: NamePath;
}

export type RuleType =
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

type Validator = (
  rule: RuleObject,
  value: StoreValue,
  callback: (error?: string) => void,
) => Promise<void> | void;

export interface ValidatorRule {
  warningOnly?: boolean;
  message?: string | VueNode;
  /** custom validate function (Note: callback must be called) */
  validator: Validator;
}

interface BaseRule {
  warningOnly?: boolean;
  /** validate the value from a list of possible values */
  enum?: StoreValue[];
  /** validate the exact length of a field */
  len?: number;
  /** validate the max length of a field */
  max?: number;
  /** validation error message */
  message?: string | VueNode;
  /** validate the min length of a field */
  min?: number;
  /** validate from a regular expression */
  pattern?: RegExp;
  /** indicates whether field is required */
  required?: boolean;
  /** transform a value before validation */
  transform?: (value: StoreValue) => StoreValue;
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?: RuleType;
  /** treat required fields that only contain whitespace as errors */
  whitespace?: boolean;
  /** Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger` */
  validateTrigger?: string | string[];
  /** Check trigger timing */
  trigger?: 'blur' | 'change' | Array<'change' | 'blur'>;
}

type AggregationRule = BaseRule & Partial<ValidatorRule>;

interface ArrayRule extends Omit<AggregationRule, 'type'> {
  type: 'array';
  defaultField?: RuleObject;
}

export type RuleObject = AggregationRule | ArrayRule;

export type Rule = RuleObject;

export interface ValidateErrorEntity<Values = any> {
  values: Values;
  errorFields: { name: InternalNamePath; errors: string[] }[];
  outOfDate: boolean;
}

export interface FieldError {
  name: InternalNamePath | string;
  errors: string[];
}

export interface RuleError {
  errors: string[];
  rule: RuleObject;
}

export interface ValidateOptions {
  triggerName?: string;
  validateMessages?: ValidateMessages;
}

export type InternalValidateFields = (
  nameList?: NamePath[],
  options?: ValidateOptions,
) => Promise<Store>;
export type ValidateFields = (nameList?: NamePath[]) => Promise<Store>;

// >>>>>> Info
interface ValueUpdateInfo {
  type: 'valueUpdate';
  source: 'internal' | 'external';
}

interface ValidateFinishInfo {
  type: 'validateFinish';
}

interface ResetInfo {
  type: 'reset';
}

interface SetFieldInfo {
  type: 'setField';
  data: FieldData;
}

interface DependenciesUpdateInfo {
  type: 'dependenciesUpdate';
  /**
   * Contains all the related `InternalNamePath[]`.
   * a <- b <- c : change `a`
   * relatedFields=[a, b, c]
   */
  relatedFields: InternalNamePath[];
}

export type NotifyInfo =
  | ValueUpdateInfo
  | ValidateFinishInfo
  | ResetInfo
  | SetFieldInfo
  | DependenciesUpdateInfo;

export type ValuedNotifyInfo = NotifyInfo & {
  store: Store;
};

export interface Callbacks<Values = any> {
  onValuesChange?: (changedValues: any, values: Values) => void;
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
  onFinish?: (values: Values) => void;
  onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void;
  onValidate?: (
    name: string | number | string[] | number[],
    status: boolean,
    errors: string[] | null,
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventArgs = any[];

type ValidateMessage = string | (() => string);
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
