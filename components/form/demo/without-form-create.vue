<cn>
#### 自行处理表单数据
使用 `Form.create` 处理后的表单具有自动收集数据并校验的功能，但如果您不需要这个功能，或者默认的行为无法满足业务需求，可以选择不使用 `Form.create` 并自行处理数据。
</cn>

<us>
#### Handle Form Data Manually
`Form.create` will collect and validate form data automatically. But if you don't need this feature or the default behaviour cannot satisfy your business, you can drop `Form.create` and handle form data manually.
</us>

<template>
  <a-form>
    <a-form-item
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      label="Prime between 8 & 12"
      :validate-status="number.validateStatus"
      :help="number.errorMsg || tips"
    >
      <a-input-number :min="8" :max="12" :value="number.value" @change="handleNumberChange" />
    </a-form-item>
  </a-form>
</template>
<script>
function validatePrimeNumber(number) {
  if (number === 11) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return {
    validateStatus: 'error',
    errorMsg: 'The prime between 8 and 12 is 11!',
  };
}
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
      number: {
        value: 11,
      },
      tips:
        'A prime is a natural number greater than 1 that has no positive divisors other than 1 and itself.',
    };
  },
  methods: {
    handleNumberChange(value) {
      this.number = {
        ...validatePrimeNumber(value),
        value,
      };
    },
  },
};
</script>
