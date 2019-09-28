<cn>
#### 自定义表单控件
自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件遵循以下的约定：
> * 提供受控属性 `value` 或其它与 [`valuePropName`](/components/form-cn/#getFieldDecorator(id,-options)-参数) 的值同名的属性。
> * 提供 `onChange` 事件或 [`trigger`](/components/form-cn/#getFieldDecorator(id,-options)-参数) 的值同名的事件。
> * 不能是函数式组件。
</cn>

<us>
#### Customized Form Controls
Customized or third-party form controls can be used in Form, too. Controls must follow these conventions:
> * It has a controlled property `value` or other name which is equal to the value of [`valuePropName`](/components/form/#getFieldDecorator(id,-options)-parameters).
> * It has event `onChange` or an event which name is equal to the value of [`trigger`](/components/form/#getFieldDecorator(id,-options)-parameters).
> * It must be a class component.
</us>

<template>
  <a-form layout="inline" :form="form" @submit="handleSubmit">
    <a-form-item label="Price">
      <price-input
        v-decorator="[
          'price',
          {
            initialValue: { number: 0, currency: 'rmb' },
            rules: [{ validator: checkPrice }],
          },
        ]"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
const hasProp = (instance, prop) => {
  const $options = instance.$options || {};
  const propsData = $options.propsData || {};
  return prop in propsData;
};
const PriceInput = {
  props: ['value'],
  template: `
    <span>
      <a-input
        type='text'
        :value="number"
        @change="handleNumberChange"
        style="width: 63%; margin-right: 2%;"
      />
      <a-select
        :value="currency"
        style="width: 32%"
        @change="handleCurrencyChange"
      >
        <a-select-option value='rmb'>RMB</a-select-option>
        <a-select-option value='dollar'>Dollar</a-select-option>
      </a-select>
    </span>
  `,
  data() {
    const value = this.value || {};
    return {
      number: value.number || 0,
      currency: value.currency || 'rmb',
    };
  },
  watch: {
    value(val = {}) {
      this.number = val.number || 0;
      this.currency = val.currency || 'rmb';
    },
  },
  methods: {
    handleNumberChange(e) {
      const number = parseInt(e.target.value || 0, 10);
      if (isNaN(number)) {
        return;
      }
      if (!hasProp(this, 'value')) {
        this.number = number;
      }
      this.triggerChange({ number });
    },
    handleCurrencyChange(currency) {
      if (!hasProp(this, 'value')) {
        this.currency = currency;
      }
      this.triggerChange({ currency });
    },
    triggerChange(changedValue) {
      // Should provide an event to pass value to Form.
      this.$emit('change', Object.assign({}, this.$data, changedValue));
    },
  },
};

export default {
  components: {
    PriceInput,
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'customized_form_controls' });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    checkPrice(rule, value, callback) {
      if (value.number > 0) {
        callback();
        return;
      }
      callback('Price must greater than zero!');
    },
  },
};
</script>
