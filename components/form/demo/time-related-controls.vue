<cn>
#### 时间类控件
时间类组件的 `value` 为 `moment` 类型，所以在提交前需要预处理。
</cn>

<us>
#### Time-related Controls
the `value` of time-related components is `moment`. So, we need to pre-process those values.
</us>


<script>
import { Form } from 'ant-design-vue'

const TimeRelatedForm = {
  methods: {
    handleSubmit  (e) {
      e.preventDefault()

      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }

        // Should format date value before submit.
        const rangeValue = fieldsValue['range-picker']
        const rangeTimeValue = fieldsValue['range-time-picker']
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
        }
        console.log('Received values of form: ', values)
      })
    },
  },

  render () {
    const { getFieldDecorator } = this.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    }
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    }
    return (
      <a-form onSubmit={this.handleSubmit}>
        <a-form-item
          {...{ props: formItemLayout }}
          label='DatePicker'
        >
          {getFieldDecorator('date-picker', config)(
            <a-date-picker />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='DatePicker[showTime]'
        >
          {getFieldDecorator('date-time-picker', config)(
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='MonthPicker'
        >
          {getFieldDecorator('month-picker', config)(
            <a-monthPicker />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='RangePicker'
        >
          {getFieldDecorator('range-picker', rangeConfig)(
            <a-range-picker />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='RangePicker[showTime]'
        >
          {getFieldDecorator('range-time-picker', rangeConfig)(
            <a-range-picker showTime format='YYYY-MM-DD HH:mm:ss' />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='TimePicker'
        >
          {getFieldDecorator('time-picker', config)(
            <a-time-picker />
          )}
        </a-form-item>
        <a-form-item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <a-button type='primary' htmlType='submit'>Submit</a-button>
        </a-form-item>
      </a-form>
    )
  },
}

export default Form.create()(TimeRelatedForm)
</script>




