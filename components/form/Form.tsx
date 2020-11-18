import { defineComponent, inject, provide, PropType, computed } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import warning from '../_util/warning';
import FormItem from './FormItem';
import { getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import { getNamePath, containsNamePath } from './utils/valueUtil';
import { defaultValidateMessages } from './utils/messages';
import { allPromiseFinish } from './utils/asyncUtil';
import { toArray } from './utils/typeUtil';
import isEqual from 'lodash-es/isEqual';
import scrollIntoView from 'scroll-into-view-if-needed';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { tuple, VueNode } from '../_util/type';
import { ColProps } from '../grid/Col';
import { InternalNamePath, NamePath, ValidateErrorEntity, ValidateOptions } from './interface';

export type ValidationRule = {
  /** validation error message */
  message?: VueNode;
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?: string;
  /** indicates whether field is required */
  required?: boolean;
  /** treat required fields that only contain whitespace as errors */
  whitespace?: boolean;
  /** validate the exact length of a field */
  len?: number;
  /** validate the min length of a field */
  min?: number;
  /** validate the max length of a field */
  max?: number;
  /** validate the value from a list of possible values */
  enum?: string | string[];
  /** validate from a regular expression */
  pattern?: RegExp;
  /** transform a value before validation */
  transform?: (value: any) => any;
  /** custom validate function (Note: callback must be called) */
  validator?: (rule: any, value: any, callback: any, source?: any, options?: any) => any;

  trigger?: string;
};

export const FormProps = {
  layout: PropTypes.oneOf(tuple('horizontal', 'inline', 'vertical')),
  labelCol: { type: Object as PropType<ColProps> },
  wrapperCol: { type: Object as PropType<ColProps> },
  colon: PropTypes.looseBool,
  labelAlign: PropTypes.oneOf(tuple('left', 'right')),
  prefixCls: PropTypes.string,
  hideRequiredMark: PropTypes.looseBool,
  model: PropTypes.object,
  rules: { type: Object as PropType<{ [k: string]: ValidationRule[] | ValidationRule }> },
  validateMessages: PropTypes.object,
  validateOnRuleChange: PropTypes.looseBool,
  // 提交失败自动滚动到第一个错误字段
  scrollToFirstError: PropTypes.looseBool,
  onFinish: PropTypes.func,
  onFinishFailed: PropTypes.func,
  name: PropTypes.string,
  validateTrigger: { type: [String, Array] as PropType<string | string[]> },
};

function isEqualName(name1: NamePath, name2: NamePath) {
  return isEqual(toArray(name1), toArray(name2));
}

const Form = defineComponent({
  name: 'AForm',
  inheritAttrs: false,
  props: initDefaultProps(FormProps, {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true,
  }),
  Item: FormItem,
  setup(props) {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      fields: [],
      form: undefined,
      lastValidatePromise: null,
      vertical: computed(() => props.layout === 'vertical'),
    };
  },
  watch: {
    rules() {
      if (this.validateOnRuleChange) {
        this.validateFields();
      }
    },
  },
  created() {
    provide('FormContext', this);
  },
  methods: {
    addField(field: any) {
      if (field) {
        this.fields.push(field);
      }
    },
    removeField(field: any) {
      if (field.fieldName) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    },
    handleSubmit(e: Event) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit('submit', e);
      const res = this.validateFields();
      res
        .then(values => {
          this.$emit('finish', values);
        })
        .catch(errors => {
          this.handleFinishFailed(errors);
        });
    },
    getFieldsByNameList(nameList: NamePath) {
      const provideNameList = !!nameList;
      const namePathList = provideNameList ? toArray(nameList).map(getNamePath) : [];
      if (!provideNameList) {
        return this.fields;
      } else {
        return this.fields.filter(
          field => namePathList.findIndex(namePath => isEqualName(namePath, field.fieldName)) > -1,
        );
      }
    },
    resetFields(name: NamePath) {
      if (!this.model) {
        warning(false, 'Form', 'model is required for resetFields to work.');
        return;
      }
      this.getFieldsByNameList(name).forEach(field => {
        field.resetField();
      });
    },
    clearValidate(name: NamePath) {
      this.getFieldsByNameList(name).forEach(field => {
        field.clearValidate();
      });
    },
    handleFinishFailed(errorInfo: ValidateErrorEntity) {
      const { scrollToFirstError } = this;
      this.$emit('finishFailed', errorInfo);
      if (scrollToFirstError && errorInfo.errorFields.length) {
        this.scrollToField(errorInfo.errorFields[0].name);
      }
    },
    validate(...args: any[]) {
      return this.validateField(...args);
    },
    scrollToField(name: NamePath, options = {}) {
      const fields = this.getFieldsByNameList(name);
      if (fields.length) {
        const fieldId = fields[0].fieldId;
        const node = fieldId ? document.getElementById(fieldId) : null;

        if (node) {
          scrollIntoView(node, {
            scrollMode: 'if-needed',
            block: 'nearest',
            ...options,
          });
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    getFieldsValue(nameList: NamePath[] | true = true) {
      const values: any = {};
      this.fields.forEach(({ fieldName, fieldValue }) => {
        values[fieldName] = fieldValue;
      });
      if (nameList === true) {
        return values;
      } else {
        const res: any = {};
        toArray(nameList as NamePath[]).forEach(
          namePath => (res[namePath as string] = values[namePath as string]),
        );
        return res;
      }
    },
    validateFields(nameList?: NamePath[], options?: ValidateOptions) {
      warning(
        !(nameList instanceof Function),
        'Form',
        'validateFields/validateField/validate not support callback, please use promise instead',
      );
      if (!this.model) {
        warning(false, 'Form', 'model is required for validateFields to work.');
        return Promise.reject('Form `model` is required for validateFields to work.');
      }
      const provideNameList = !!nameList;
      const namePathList: InternalNamePath[] = provideNameList
        ? toArray(nameList).map(getNamePath)
        : [];

      // Collect result in promise list
      const promiseList: Promise<{
        name: InternalNamePath;
        errors: string[];
      }>[] = [];

      this.fields.forEach(field => {
        // Add field if not provide `nameList`
        if (!provideNameList) {
          namePathList.push(field.getNamePath());
        }

        // Skip if without rule
        if (!field.getRules().length) {
          return;
        }

        const fieldNamePath = field.getNamePath();

        // Add field validate rule in to promise list
        if (!provideNameList || containsNamePath(namePathList, fieldNamePath)) {
          const promise = field.validateRules({
            validateMessages: {
              ...defaultValidateMessages,
              ...this.validateMessages,
            },
            ...options,
          });

          // Wrap promise with field
          promiseList.push(
            promise
              .then(() => ({ name: fieldNamePath, errors: [] }))
              .catch((errors: any) =>
                Promise.reject({
                  name: fieldNamePath,
                  errors,
                }),
              ),
          );
        }
      });

      const summaryPromise = allPromiseFinish(promiseList);
      this.lastValidatePromise = summaryPromise;

      const returnPromise = summaryPromise
        .then(() => {
          if (this.lastValidatePromise === summaryPromise) {
            return Promise.resolve(this.getFieldsValue(namePathList));
          }
          return Promise.reject([]);
        })
        .catch(results => {
          const errorList = results.filter(result => result && result.errors.length);
          return Promise.reject({
            values: this.getFieldsValue(namePathList),
            errorFields: errorList,
            outOfDate: this.lastValidatePromise !== summaryPromise,
          });
        });

      // Do not throw in console
      returnPromise.catch(e => e);

      return returnPromise;
    },
    validateField(...args: any[]) {
      return this.validateFields(...args);
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, hideRequiredMark, layout, handleSubmit } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('form', customizePrefixCls);
    const { class: className, onSubmit: originSubmit, ...restProps } = this.$attrs;

    const formClassName = classNames(prefixCls, className, {
      [`${prefixCls}-horizontal`]: layout === 'horizontal',
      [`${prefixCls}-vertical`]: layout === 'vertical',
      [`${prefixCls}-inline`]: layout === 'inline',
      [`${prefixCls}-hide-required-mark`]: hideRequiredMark,
    });
    return (
      <form onSubmit={handleSubmit} class={formClassName} {...restProps}>
        {getSlot(this)}
      </form>
    );
  },
});

export default Form as typeof Form & {
  readonly Item: typeof FormItem;
};
