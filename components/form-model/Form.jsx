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
import { getParams } from './utils';

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
      const res = this.validate();
      res
        .then(values => {
          this.$emit('finish', values);
        })
        .catch(errors => {
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
    getFieldsValue(allFields) {
      const values = {};
      allFields.forEach(({ prop, fieldValue }) => {
        values[prop] = fieldValue;
      });
      return values;
    },
    validateFields() {
      return this.validateField(...arguments);
    },
    validateField(ns, opt, cb) {
      const pending = new Promise((resolve, reject) => {
        const params = getParams(ns, opt, cb);
        const { names, options } = params;
        let { callback } = params;
        if (!callback || typeof callback === 'function') {
          const oldCb = callback;
          callback = (errorFields, values) => {
            if (oldCb) {
              oldCb(errorFields, values);
            } else if (errorFields) {
              reject({ errorFields, values });
            } else {
              resolve(values);
            }
          };
        }
        const allFields = names
          ? this.fields.filter(field => names.indexOf(field.prop) !== -1)
          : this.fields;
        const fields = allFields.filter(field => {
          const rules = field.getFilteredRule('');
          return rules && rules.length;
        });
        if (!fields.length) {
          callback(null, this.getFieldsValue(allFields));
          return;
        }
        if (!('firstFields' in options)) {
          options.firstFields = allFields.filter(field => {
            return !!field.validateFirst;
          });
        }
        let fieldsErrors = {};
        let valid = true;
        let count = 0;
        const promiseList = [];
        fields.forEach(field => {
          const promise = field.validate('', errors => {
            if (errors) {
              valid = false;
              fieldsErrors[field.prop] = errors;
            }

            if (++count === fields.length) {
              callback(valid ? null : fieldsErrors, this.getFieldsValue(fields));
            }
          });
          promiseList.push(promise.then(() => {}));
        });
      });
      pending.catch(e => {
        if (console.error && process.env.NODE_ENV !== 'production') {
          console.error(e);
        }
        return e;
      });
      return pending;
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
