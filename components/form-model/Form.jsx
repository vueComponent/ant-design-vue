import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { ColProps } from '../grid/Col';
import isRegExp from 'lodash/isRegExp';
import warning from '../_util/warning';
import FormItem from './FormItem';
import { initDefaultProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

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
};

export const ValidationRule = {
  /** validation error message */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
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
  props: initDefaultProps(FormProps, {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true,
  }),
  Item: FormItem,
  created() {
    this.fields = [];
  },
  provide() {
    return {
      FormContext: this,
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
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
    onSubmit(e) {
      if (!getListeners(this).submit) {
        e.preventDefault();
      } else {
        this.$emit('submit', e);
      }
    },
    resetFields() {
      if (!this.model) {
        warning(false, 'FormModel', 'model is required for resetFields to work.');
        return;
      }
      this.fields.forEach(field => {
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
    validate(callback) {
      if (!this.model) {
        warning(false, 'FormModel', 'model is required for resetFields to work.');
        return;
      }
      let promise;
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function(valid) {
            valid ? resolve(valid) : reject(valid);
          };
        });
      }
      let valid = true;
      let count = 0;
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      let invalidFields = {};
      this.fields.forEach(field => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false;
          }
          invalidFields = Object.assign({}, invalidFields, field);
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid, invalidFields);
          }
        });
      });
      if (promise) {
        return promise;
      }
    },
    validateField(props, cb) {
      props = [].concat(props);
      const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1);
      if (!fields.length) {
        warning(false, 'FormModel', 'please pass correct props!');
        return;
      }
      fields.forEach(field => {
        field.validate('', cb);
      });
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, hideRequiredMark, layout, onSubmit, $slots } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('form', customizePrefixCls);

    const formClassName = classNames(prefixCls, {
      [`${prefixCls}-horizontal`]: layout === 'horizontal',
      [`${prefixCls}-vertical`]: layout === 'vertical',
      [`${prefixCls}-inline`]: layout === 'inline',
      [`${prefixCls}-hide-required-mark`]: hideRequiredMark,
    });
    return (
      <form onSubmit={onSubmit} class={formClassName}>
        {$slots.default}
      </form>
    );
  },
};

export default Form;
