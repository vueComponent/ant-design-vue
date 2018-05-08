<cn>
#### 动态校验规则
根据不同情况执行不同的校验规则。
</cn>

<us>
#### Dynamic Rules
Perform different check rules according to different situations.
</us>


<script>
import { Form } from 'vue-antd-ui'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
}
const DynamicRule = {
  data () {
    return {
      checkNick: false,
    }
  },
  methods: {
    check  () {
      this.form.validateFields(
        (err) => {
          if (!err) {
            console.info('success')
          }
        },
      )
    },
    handleChange  (e) {
      this.checkNick = e.target.checked
      this.$nextTick(() => {
        this.form.validateFields(['nickname'], { force: true })
      })
    },
  },

  render () {
    const { getFieldDecorator } = this.form
    return (
      <div>
        <a-form-item {...{ props: formItemLayout }} label='Name'>
          {getFieldDecorator('username', {
            rules: [{
              required: true,
              message: 'Please input your name',
            }],
          })(
            <a-input placeholder='Please input your name' />
          )}
        </a-form-item>
        <a-form-item {...{ props: formItemLayout }} label='Nickname'>
          {getFieldDecorator('nickname', {
            rules: [{
              required: this.checkNick,
              message: 'Please input your nickname',
            }],
          })(
            <a-input placeholder='Please input your nickname' />
          )}
        </a-form-item>
        <a-form-item {...{ props: formTailLayout }}>
          <a-checkbox
            value={this.checkNick}
            onChange={this.handleChange}
          >
            Nickname is required
          </a-checkbox>
        </a-form-item>
        <a-form-item {...{ props: formTailLayout }}>
          <a-button type='primary' onClick={this.check}>
            Check
          </a-button>
        </a-form-item>
      </div>
    )
  },
}

export default Form.create()(DynamicRule)
</script>




