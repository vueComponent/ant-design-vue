import { inject, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { ColProps } from '../grid/Col';
import isRegExp from 'lodash-es/isRegExp';
import warning from '../_util/warning';
import FormItem from './FormItem';
import { initDefaultProps, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import { getNamePath, containsNamePath } from './utils/valueUtil';
import { defaultValidateMessages } from './utils/messages';
import { allPromiseFinish } from './utils/asyncUtil';
import { toArray } from './utils/typeUtil';
import isEqual from 'lodash-es/isEqual';
import scrollIntoView from 'scroll-into-view-if-needed';

export const FormProps = {
  layout: PropTypes.oneOf(['horizontal', 'inline', 'vertical']),
  labelCol: PropTypes.shape(ColProps).loose,
  wrapperCol: PropTypes.shape(ColProps).loose,
  colon: PropTypes.bool,
  labelAlign: PropTypes.oneOf(['left', 'right']),
  prefixCls: PropTypes.string,
  hideRequiredMark: PropTypes.bool,
  model: PropTypes.object,
  rules: PropTypes.object,
  validateMessages: PropTypes.any,
  validateOnRuleChange: PropTypes.bool,
  // 提交失败自动滚动到第一个错误字段
  scrollToFirstError: PropTypes.bool,
  onFinish: PropTypes.func,
  onFinishFailed: PropTypes.func,
  name: PropTypes.name,
  validateTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export const ValidationRule = {
  /** validation error message */
  message: PropTypes.string,
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type: PropTypes.string,
  /** indicates whether field is required */
  required: PropTypes.boolean,
  /** treat required fields that only contain whitespace as errors */
  whitespace: PropTypes.boolean,
  /** validate the exact length of a field */
  len: PropTypes.number,
  /** validate the min length of a field */
  min: PropTypes.number,
  /** validate the max length of a field */
  max: PropTypes.number,
  /** validate the value from a list of possible values */
  enum: PropTypes.oneOfType([String, PropTypes.arrayOf(String)]),
  /** validate from a regular expression */
  pattern: PropTypes.custom(isRegExp),
  /** transform a value before validation */
  transform: PropTypes.func,
  /** custom validate function (Note: callback must be called) */
  validator: PropTypes.func,
};

function isEqualName(name1, name2) {
  return isEqual(toArray(name1), toArray(name2));
}

const Form = {
  name: 'AForm',
  inheritAttrs: false,
  props: initDefaultProps(FormProps, {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true,
  }),
  Item: FormItem,
  created() {
    this.fields = [];
    this.form = undefined;
    this.lastValidatePromise = null;
    provide('FormContext', this);
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  watch: {
    rules() {
      if (this.validateOnRuleChange) {
        this.validateFields();
      }
    },
  },
  computed: {
    vertical() {
      return this.layout === 'vertical';
    },
  },
  methods: {
    addField(field) {
      if (field) {
        this.fields.push(field);
      }
    },
    removeField(field) {
      if (field.fieldName) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    },
    handleSubmit(e) {
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
    getFieldsByNameList(nameList) {
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
    resetFields(name) {
      if (!this.model) {
        warning(false, 'Form', 'model is required for resetFields to work.');
        return;
      }
      this.getFieldsByNameList(name).forEach(field => {
        field.resetField();
      });
    },
    clearValidate(name) {
      this.getFieldsByNameList(name).forEach(field => {
        field.clearValidate();
      });
    },
    handleFinishFailed(errorInfo) {
      const { scrollToFirstError } = this;
      this.$emit('finishFailed', errorInfo);
      if (scrollToFirstError && errorInfo.errorFields.length) {
        this.scrollToField(errorInfo.errorFields[0].name);
      }
    },
    validate() {
      return this.validateField(...arguments);
    },
    scrollToField(name, options = {}) {
      const fields = this.getFieldsByNameList([name]);
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
    getFieldsValue(nameList = true) {
      const values = {};
      this.fields.forEach(({ fieldName, fieldValue }) => {
        values[fieldName] = fieldValue;
      });
      if (nameList === true) {
        return values;
      } else {
        const res = {};
        toArray(nameList).forEach(namePath => (res[namePath] = values[namePath]));
        return res;
      }
    },
    validateFields(nameList, options) {
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
      const namePathList = provideNameList ? toArray(nameList).map(getNamePath) : [];

      // Collect result in promise list
      const promiseList = [];

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
              .catch(errors =>
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
    validateField() {
      return this.validateFields(...arguments);
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
};

export default Form;
