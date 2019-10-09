import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import Vue from 'vue';
import isRegExp from 'lodash/isRegExp';
import warning from '../_util/warning';
import createDOMForm from '../vc-form/src/createDOMForm';
import createFormField from '../vc-form/src/createFormField';
import FormItem from './FormItem';
import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants';
import { initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

export const FormCreateOption = {
  onFieldsChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  mapPropsToFields: PropTypes.func,
  validateMessages: PropTypes.any,
  withRef: PropTypes.bool,
  name: PropTypes.string,
};

// function create
export const WrappedFormUtils = {
  /** 获取一组输入控件的值，如不传入参数，则获取全部组件的值 */
  getFieldsValue: PropTypes.func,
  /** 获取一个输入控件的值*/
  getFieldValue: PropTypes.func,
  /** 设置一组输入控件的值*/
  setFieldsValue: PropTypes.func,
  /** 设置一组输入控件的值*/
  setFields: PropTypes.func,
  /** 校验并获取一组输入域的值与 Error */
  validateFields: PropTypes.func,
  // validateFields(fieldNames: Array<string>, options: Object, callback: ValidateCallback): void;
  // validateFields(fieldNames: Array<string>, callback: ValidateCallback): void;
  // validateFields(options: Object, callback: ValidateCallback): void;
  // validateFields(callback: ValidateCallback): void;
  // validateFields(): void;
  /** 与 `validateFields` 相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围 */
  validateFieldsAndScroll: PropTypes.func,
  // validateFieldsAndScroll(fieldNames?: Array<string>, options?: Object, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(fieldNames?: Array<string>, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(options?: Object, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(callback?: ValidateCallback): void;
  // validateFieldsAndScroll(): void;
  /** 获取某个输入控件的 Error */
  getFieldError: PropTypes.func,
  getFieldsError: PropTypes.func,
  /** 判断一个输入控件是否在校验状态*/
  isFieldValidating: PropTypes.func,
  isFieldTouched: PropTypes.func,
  isFieldsTouched: PropTypes.func,
  /** 重置一组输入控件的值与状态，如不传入参数，则重置所有组件 */
  resetFields: PropTypes.func,

  getFieldDecorator: PropTypes.func,
};

export const FormProps = {
  layout: PropTypes.oneOf(['horizontal', 'inline', 'vertical']),
  form: PropTypes.object,
  // onSubmit: React.FormEventHandler<any>;
  prefixCls: PropTypes.string,
  hideRequiredMark: PropTypes.bool,
  autoFormCreate: PropTypes.func,
  options: PropTypes.object,
  selfUpdate: PropTypes.bool,
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

// export type ValidateCallback = (errors: any, values: any) => void;

// export type GetFieldDecoratorOptions = {
//   /** 子节点的值的属性，如 Checkbox 的是 'checked' */
//   valuePropName?: string;
//   /** 子节点的初始值，类型、可选值均由子节点决定 */
//   initialValue?: any;
//   /** 收集子节点的值的时机 */
//   trigger?: string;
//   /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
//   getValueFromEvent?: (...args: any[]) => any;
//   /** Get the component props according to field value. */
//   getValueProps?: (value: any) => any;
//   /** 校验子节点值的时机 */
//   validateTrigger?: string | string[];
//   /** 校验规则，参见 [async-validator](https://github.com/yiminghe/async-validator) */
//   rules?: ValidationRule[];
//   /** 是否和其他控件互斥，特别用于 Radio 单选控件 */
//   exclusive?: boolean;
//   /** Normalize value to form component */
//   normalize?: (value: any, prevValue: any, allValues: any) => any;
//   /** Whether stop validate on first rule of error for this field.  */
//   validateFirst?: boolean;
//   /** 是否一直保留子节点的信息 */
//   preserve?: boolean;
// };

const Form = {
  name: 'AForm',
  props: initDefaultProps(FormProps, {
    layout: 'horizontal',
    hideRequiredMark: false,
  }),
  Item: FormItem,
  createFormField: createFormField,
  create: (options = {}) => {
    return createDOMForm({
      fieldNameProp: 'id',
      ...options,
      fieldMetaProp: FIELD_META_PROP,
      fieldDataProp: FIELD_DATA_PROP,
    });
  },
  createForm(context, options = {}) {
    const V = Base.Vue || Vue;
    return new V(Form.create({ ...options, templateContext: context })());
  },
  created() {
    this.formItemContexts = new Map();
  },
  provide() {
    return {
      FormProps: this.$props,
      // https://github.com/vueComponent/ant-design-vue/issues/446
      collectFormItemContext:
        this.form && this.form.templateContext
          ? (c, type = 'add') => {
              const formItemContexts = this.formItemContexts;
              const number = formItemContexts.get(c) || 0;
              if (type === 'delete') {
                if (number <= 1) {
                  formItemContexts.delete(c);
                } else {
                  formItemContexts.set(c, number - 1);
                }
              } else {
                if (c !== this.form.templateContext) {
                  formItemContexts.set(c, number + 1);
                }
              }
            }
          : () => {},
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  watch: {
    form() {
      this.$forceUpdate();
    },
  },
  beforeUpdate() {
    this.formItemContexts.forEach((number, c) => {
      if (c.$forceUpdate) {
        c.$forceUpdate();
      }
    });
  },
  updated() {
    if (this.form && this.form.cleanUpUselessFields) {
      this.form.cleanUpUselessFields();
    }
  },
  methods: {
    onSubmit(e) {
      const { $listeners } = this;
      if (!$listeners.submit) {
        e.preventDefault();
      } else {
        this.$emit('submit', e);
      }
    },
  },

  render() {
    const {
      prefixCls: customizePrefixCls,
      hideRequiredMark,
      layout,
      onSubmit,
      $slots,
      autoFormCreate,
      options = {},
    } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('form', customizePrefixCls);

    const formClassName = classNames(prefixCls, {
      [`${prefixCls}-horizontal`]: layout === 'horizontal',
      [`${prefixCls}-vertical`]: layout === 'vertical',
      [`${prefixCls}-inline`]: layout === 'inline',
      [`${prefixCls}-hide-required-mark`]: hideRequiredMark,
    });
    if (autoFormCreate) {
      warning(false, '`autoFormCreate` is deprecated. please use `form` instead.');
      const DomForm =
        this.DomForm ||
        createDOMForm({
          fieldNameProp: 'id',
          ...options,
          fieldMetaProp: FIELD_META_PROP,
          fieldDataProp: FIELD_DATA_PROP,
          templateContext: this.$vnode.context,
        })({
          provide() {
            return {
              decoratorFormProps: this.$props,
            };
          },
          data() {
            return {
              children: $slots.default,
              formClassName: formClassName,
              submit: onSubmit,
            };
          },
          created() {
            autoFormCreate(this.form);
          },
          render() {
            const { children, formClassName, submit } = this;
            return (
              <form onSubmit={submit} class={formClassName}>
                {children}
              </form>
            );
          },
        });
      if (this.domForm) {
        this.domForm.children = $slots.default;
        this.domForm.submit = onSubmit;
        this.domForm.formClassName = formClassName;
      }
      this.DomForm = DomForm;

      return (
        <DomForm
          wrappedComponentRef={inst => {
            this.domForm = inst;
          }}
        />
      );
    }
    return (
      <form onSubmit={onSubmit} class={formClassName}>
        {$slots.default}
      </form>
    );
  },
};

export default Form;
