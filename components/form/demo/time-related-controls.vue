<cn>
#### 时间类控件
时间类组件的 `value` 类型为 `moment` 对象，所以在提交服务器前需要预处理。
</cn>

<us>
#### Time-related Controls
The `value` of time-related components is a `moment` object, which we need to pre-process it before we submit to server.
</us>

<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item v-bind="formItemLayout" label="DatePicker">
      <a-date-picker v-decorator="['date-picker', config]" />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="DatePicker[showTime]">
      <a-date-picker
        v-decorator="['date-time-picker', config]"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="MonthPicker">
      <a-monthPicker v-decorator="['month-picker', config]" />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="RangePicker">
      <a-range-picker v-decorator="['range-picker', rangeConfig]" />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="RangePicker[showTime]">
      <a-range-picker
        v-decorator="['range-time-picker', rangeConfig]"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="TimePicker">
      <a-time-picker v-decorator="['time-picker', config]" />
    </a-form-item>
    <a-form-item
      :wrapper-col="{
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
      }"
    >
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
export default {
  data() {
    return {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      config: {
        rules: [{ type: 'object', required: true, message: 'Please select time!' }],
      },
      rangeConfig: {
        rules: [{ type: 'array', required: true, message: 'Please select time!' }],
      },
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'time_related_controls' });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }

        // Should format date value before submit.
        const rangeValue = fieldsValue['range-picker'];
        const rangeTimeValue = fieldsValue['range-time-picker'];
        const values = {
          ...fieldsValue,
          'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
          'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
          'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
          'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
          'range-time-picker': [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
          ],
          'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
        };
        console.log('Received values of form: ', values);
      });
    },
  },
};
</script>
