import type { Slot } from '@/utils/types'

export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating' | ''
export type NamePath = string | number | (string | number)[]

export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'email'
  | 'hex'
  | 'regexp'
  | 'any'

export interface Rule {
  type?: RuleType
  required?: boolean
  message?: string
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  enum?: any[]
  whitespace?: boolean
  transform?: (value: any) => any
  validator?: (rule: Rule, value: any) => Promise<void>
  trigger?: string | string[]
  warningOnly?: boolean
}

export interface ColProps {
  span?: number
  offset?: number
  push?: number
  pull?: number
  style?: Record<string, string> | string
}

export interface FormProps {
  model?: Record<string, any>
  rules?: Record<string, Rule | Rule[]>
  layout?: FormLayout
  labelCol?: ColProps
  wrapperCol?: ColProps
  colon?: boolean
  requiredMark?: boolean | 'optional'
  validateTrigger?: string | string[]
  scrollToFirstError?: boolean
  name?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  labelAlign?: 'left' | 'right'
  labelWrap?: boolean
  hideRequiredMark?: boolean
}

export const formDefaultProps = {
  layout: 'horizontal' as const,
  colon: true,
  requiredMark: undefined as undefined | boolean | 'optional',
  labelAlign: 'right' as const,
  labelWrap: false,
  hideRequiredMark: false,
  scrollToFirstError: false,
  disabled: undefined as undefined | boolean,
} as const

export interface FormEmits {
  (e: 'finish', values: Record<string, any>): void
  (e: 'finishFailed', errorInfo: { values: Record<string, any>; errorFields: FieldError[] }): void
  (e: 'validate', name: NamePath, status: ValidateStatus, errors: string[]): void
  (e: 'valuesChange', changedValues: Record<string, any>, allValues: Record<string, any>): void
}

export interface FormSlots {
  default?: Slot
}

export interface FormItemProps {
  label?: string
  name?: NamePath
  rules?: Rule[]
  required?: boolean
  validateStatus?: ValidateStatus
  help?: string
  extra?: string
  labelCol?: ColProps
  wrapperCol?: ColProps
  colon?: boolean
  tooltip?: string
  hasFeedback?: boolean
  validateTrigger?: string | string[]
  labelAlign?: 'left' | 'right'
}

export interface FormItemSlots {
  default?: Slot
  label?: Slot
  help?: Slot
  extra?: Slot
  tooltip?: Slot
}

export interface FieldError {
  name: NamePath
  errors: string[]
  warnings: string[]
}

export interface FormInstance {
  validate: (nameList?: NamePath[]) => Promise<Record<string, any>>
  validateFields: (nameList?: NamePath[]) => Promise<Record<string, any>>
  resetFields: (nameList?: NamePath[]) => void
  clearValidate: (nameList?: NamePath[]) => void
  getFieldsValue: (nameList?: NamePath[] | true) => Record<string, any>
  getFieldValue: (name: NamePath) => any
  setFieldValue: (name: NamePath, value: any) => void
  setFieldsValue: (values: Record<string, any>) => void
  scrollToField: (name: NamePath) => void
}
