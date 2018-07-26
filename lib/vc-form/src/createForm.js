'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mixin = undefined;

var _createBaseForm = require('./createBaseForm');

var _createBaseForm2 = _interopRequireDefault(_createBaseForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var mixin = exports.mixin = {
  methods: {
    getForm: function getForm() {
      return {
        getFieldsValue: this.fieldsStore.getFieldsValue,
        getFieldValue: this.fieldsStore.getFieldValue,
        getFieldInstance: this.getFieldInstance,
        setFieldsValue: this.setFieldsValue,
        setFields: this.setFields,
        setFieldsInitialValue: this.fieldsStore.setFieldsInitialValue,
        getFieldDecorator: this.getFieldDecorator,
        getFieldProps: this.getFieldProps,
        getFieldsError: this.fieldsStore.getFieldsError,
        getFieldError: this.fieldsStore.getFieldError,
        isFieldValidating: this.fieldsStore.isFieldValidating,
        isFieldsValidating: this.fieldsStore.isFieldsValidating,
        isFieldsTouched: this.fieldsStore.isFieldsTouched,
        isFieldTouched: this.fieldsStore.isFieldTouched,
        isSubmitting: this.isSubmitting,
        submit: this.submit,
        validateFields: this.validateFields,
        resetFields: this.resetFields
      };
    }
  }
};

function createForm(options) {
  return (0, _createBaseForm2['default'])(options, [mixin]);
}

exports['default'] = createForm;