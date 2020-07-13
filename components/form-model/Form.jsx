import { inject, provide } from 'vue';
// import scrollIntoView from 'dom-scroll-into-view';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { ColProps } from '../grid/Col';
import isRegExp from 'lodash/isRegExp';
import warning from '../_util/warning';
import FormItem from './FormItem';
import { initDefaultProps, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import { getNamePath, containsNamePath } from './utils/valueUtil';
import { defaultValidateMessages } from './utils/messages';
import { allPromiseFinish } from './utils/asyncUtil';
import { toArray } from './utils/typeUtil';

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

const Form = {
  name: 'AFormModel',
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
        this.validate(() => {});
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
      if (field.prop) {
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
          // eslint-disable-next-line no-console
          console.log('values', values);
          this.$emit('finish', values);
        })
        .catch(errors => {
          // eslint-disable-next-line no-console
          console.log('errors', errors);
          this.handleFinishFailed(errors);
        });
    },
    resetFields(props = []) {
      if (!this.model) {
        warning(false, 'FormModel', 'model is required for resetFields to work.');
        return;
      }
      const fields = props.length
        ? typeof props === 'string'
          ? this.fields.filter(field => props === field.prop)
          : this.fields.filter(field => props.indexOf(field.prop) > -1)
        : this.fields;
      fields.forEach(field => {
        field.resetField();
      });
    },
    clearValidate(props = []) {
      const fields = props.length
        ? typeof props === 'string'
          ? this.fields.filter(field => props === field.prop)
          : this.fields.filter(field => props.indexOf(field.prop) > -1)
        : this.fields;
      fields.forEach(field => {
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

      // if (!this.model) {
      //   warning(false, 'FormModel', 'model is required for resetFields to work.');
      //   return;
      // }
      // let promise;
      // // if no callback, return promise
      // if (typeof callback !== 'function' && window.Promise) {
      //   promise = new window.Promise((resolve, reject) => {
      //     callback = function(valid) {
      //       valid ? resolve(valid) : reject(valid);
      //     };
      //   });
      // }
      // let valid = true;
      // let count = 0;
      // // 如果需要验证的fields为空，调用验证时立刻返回callback
      // if (this.fields.length === 0 && callback) {
      //   callback(true);
      // }
      // let invalidFields = {};
      // this.fields.forEach(field => {
      //   field.validate('', (message, field) => {
      //     if (message) {
      //       valid = false;
      //     }
      //     invalidFields = Object.assign({}, invalidFields, field);
      //     if (typeof callback === 'function' && ++count === this.fields.length) {
      //       callback(valid, invalidFields);
      //     }
      //   });
      // });
      // if (promise) {
      //   return promise;
      // }
    },
    scrollToField() {},
    // TODO
    // eslint-disable-next-line no-unused-vars
    getFieldsValue(nameList) {
      const values = {};
      this.fields.forEach(({ prop, fieldValue }) => {
        values[prop] = fieldValue;
      });
      return values;
    },
    validateFields(nameList, options) {
      if (!this.model) {
        warning(false, 'Form', 'model is required for validateFields to work.');
        return;
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

      // // Notify fields with rule that validate has finished and need update
      // summaryPromise
      //   .catch(results => results)
      //   .then(results => {
      //     const resultNamePathList = results.map(({ name }) => name);
      //     // eslint-disable-next-line no-console
      //     console.log(resultNamePathList);
      //   });

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
