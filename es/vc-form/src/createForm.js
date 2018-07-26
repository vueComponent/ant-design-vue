import createBaseForm from './createBaseForm';

export var mixin = {
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
  return createBaseForm(options, [mixin]);
}

export default createForm;