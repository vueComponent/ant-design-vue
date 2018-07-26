'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationRule = exports.FormProps = exports.WrappedFormUtils = exports.FormCreateOption = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _isRegExp = require('lodash/isRegExp');

var _isRegExp2 = _interopRequireDefault(_isRegExp);

var _createDOMForm = require('../vc-form/src/createDOMForm');

var _createDOMForm2 = _interopRequireDefault(_createDOMForm);

var _createFormField = require('../vc-form/src/createFormField');

var _createFormField2 = _interopRequireDefault(_createFormField);

var _FormItem = require('./FormItem');

var _FormItem2 = _interopRequireDefault(_FormItem);

var _constants = require('./constants');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FormCreateOption = exports.FormCreateOption = {
  onFieldsChange: _vueTypes2['default'].func,
  onValuesChange: _vueTypes2['default'].func,
  mapPropsToFields: _vueTypes2['default'].func,
  withRef: _vueTypes2['default'].bool

  // function create
};var WrappedFormUtils = exports.WrappedFormUtils = {
  /** 获取一组输入控件的值，如不传入参数，则获取全部组件的值 */
  getFieldsValue: _vueTypes2['default'].func,
  /** 获取一个输入控件的值*/
  getFieldValue: _vueTypes2['default'].func,
  /** 设置一组输入控件的值*/
  setFieldsValue: _vueTypes2['default'].func,
  /** 设置一组输入控件的值*/
  setFields: _vueTypes2['default'].func,
  /** 校验并获取一组输入域的值与 Error */
  validateFields: _vueTypes2['default'].func,
  // validateFields(fieldNames: Array<string>, options: Object, callback: ValidateCallback): void;
  // validateFields(fieldNames: Array<string>, callback: ValidateCallback): void;
  // validateFields(options: Object, callback: ValidateCallback): void;
  // validateFields(callback: ValidateCallback): void;
  // validateFields(): void;
  /** 与 `validateFields` 相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围 */
  validateFieldsAndScroll: _vueTypes2['default'].func,
  // validateFieldsAndScroll(fieldNames?: Array<string>, options?: Object, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(fieldNames?: Array<string>, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(options?: Object, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(callback?: ValidateCallback): void;
  // validateFieldsAndScroll(): void;
  /** 获取某个输入控件的 Error */
  getFieldError: _vueTypes2['default'].func,
  getFieldsError: _vueTypes2['default'].func,
  /** 判断一个输入控件是否在校验状态*/
  isFieldValidating: _vueTypes2['default'].func,
  isFieldTouched: _vueTypes2['default'].func,
  isFieldsTouched: _vueTypes2['default'].func,
  /** 重置一组输入控件的值与状态，如不传入参数，则重置所有组件 */
  resetFields: _vueTypes2['default'].func,

  getFieldDecorator: _vueTypes2['default'].func
};

var FormProps = exports.FormProps = {
  layout: _vueTypes2['default'].oneOf(['horizontal', 'inline', 'vertical']),
  form: _vueTypes2['default'].shape(WrappedFormUtils).loose,
  // onSubmit: React.FormEventHandler<any>;
  prefixCls: _vueTypes2['default'].string,
  hideRequiredMark: _vueTypes2['default'].bool,
  autoFormCreate: _vueTypes2['default'].func,
  options: _vueTypes2['default'].object
};

var ValidationRule = exports.ValidationRule = {
  /** validation error message */
  message: _vueTypes2['default'].string,
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type: _vueTypes2['default'].string,
  /** indicates whether field is required */
  required: _vueTypes2['default'].boolean,
  /** treat required fields that only contain whitespace as errors */
  whitespace: _vueTypes2['default'].boolean,
  /** validate the exact length of a field */
  len: _vueTypes2['default'].number,
  /** validate the min length of a field */
  min: _vueTypes2['default'].number,
  /** validate the max length of a field */
  max: _vueTypes2['default'].number,
  /** validate the value from a list of possible values */
  'enum': _vueTypes2['default'].oneOfType([String, _vueTypes2['default'].arrayOf(String)]),
  /** validate from a regular expression */
  pattern: _vueTypes2['default'].custom(_isRegExp2['default']),
  /** transform a value before validation */
  transform: _vueTypes2['default'].func,
  /** custom validate function (Note: callback must be called) */
  validator: _vueTypes2['default'].func

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
  // };

};exports['default'] = {
  name: 'AForm',
  props: (0, _propsUtil.initDefaultProps)(FormProps, {
    prefixCls: 'ant-form',
    layout: 'horizontal',
    hideRequiredMark: false
  }),
  // static defaultProps = {
  //   prefixCls: 'ant-form',
  //   layout: 'horizontal',
  //   hideRequiredMark: false,
  //   onSubmit (e) {
  //     e.preventDefault()
  //   },
  // };

  // static propTypes = {
  //   prefixCls: PropTypes.string,
  //   layout: PropTypes.oneOf(['horizontal', 'inline', 'vertical']),
  //   children: PropTypes.any,
  //   onSubmit: PropTypes.func,
  //   hideRequiredMark: PropTypes.bool,
  // };

  Item: _FormItem2['default'],

  createFormField: _createFormField2['default'],

  create: function create() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return (0, _createDOMForm2['default'])((0, _extends3['default'])({
      fieldNameProp: 'id'
    }, options, {
      fieldMetaProp: _constants.FIELD_META_PROP,
      fieldDataProp: _constants.FIELD_DATA_PROP
    }));
  },
  provide: function provide() {
    return {
      FormProps: this.$props
    };
  },

  methods: {
    onSubmit: function onSubmit(e) {
      var $listeners = this.$listeners;

      if (!$listeners.submit) {
        e.preventDefault();
      } else {
        this.$emit('submit', e);
      }
    }
  },

  render: function render() {
    var _classNames,
        _this = this;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        hideRequiredMark = this.hideRequiredMark,
        layout = this.layout,
        onSubmit = this.onSubmit,
        $slots = this.$slots,
        autoFormCreate = this.autoFormCreate,
        _options = this.options,
        options = _options === undefined ? {} : _options;


    var formClassName = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-horizontal', layout === 'horizontal'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-vertical', layout === 'vertical'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-inline', layout === 'inline'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-hide-required-mark', hideRequiredMark), _classNames));
    if (autoFormCreate) {
      var DomForm = this.DomForm || (0, _createDOMForm2['default'])((0, _extends3['default'])({
        fieldNameProp: 'id'
      }, options, {
        fieldMetaProp: _constants.FIELD_META_PROP,
        fieldDataProp: _constants.FIELD_DATA_PROP,
        templateContext: this.$vnode.context
      }))({
        provide: function provide() {
          return {
            decoratorFormProps: this.$props
          };
        },
        data: function data() {
          return {
            children: $slots['default'],
            formClassName: formClassName,
            submit: onSubmit
          };
        },
        created: function created() {
          autoFormCreate(this.form);
        },
        render: function render() {
          var h = arguments[0];
          var children = this.children,
              formClassName = this.formClassName,
              submit = this.submit;

          return h(
            'form',
            {
              on: {
                'submit': submit
              },
              'class': formClassName },
            [children]
          );
        }
      });
      if (this.domForm) {
        this.domForm.children = $slots['default'];
        this.domForm.submit = onSubmit;
        this.domForm.formClassName = formClassName;
      }
      this.DomForm = DomForm;

      return h(DomForm, {
        attrs: { wrappedComponentRef: function wrappedComponentRef(inst) {
            _this.domForm = inst;
          } }
      });
    }

    return h(
      'form',
      {
        on: {
          'submit': onSubmit
        },
        'class': formClassName },
      [$slots['default']]
    );
  }
};