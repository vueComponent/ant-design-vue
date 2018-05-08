<cn>
#### 水平登录栏
水平登录栏，常用在顶部导航栏中。
</cn>

<us>
#### Horizontal Login Form
Horizontal login form is often used in navigation bar.
</us>


<script>
import { Form } from 'vue-antd-ui'

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const HorizontalLoginForm = {
  mounted () {
    // To disabled submit button at the beginning.
    this.form.validateFields()
  },
  methods: {
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
  },

  render () {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.form

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName')
    const passwordError = isFieldTouched('password') && getFieldError('password')
    return (
      <a-form layout='inline' onSubmit={this.handleSubmit}>
        <a-form-item
          validateStatus={userNameError ? 'error' : ''}
          help={userNameError || ''}
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <a-input prefix={<a-icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Username' />
          )}
        </a-form-item>
        <a-form-item
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <a-input prefix={<a-icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
          )}
        </a-form-item>
        <a-form-item>
          <a-button
            type='primary'
            htmlType='submit'
            disabled={hasErrors(getFieldsError())}
          >
            Log in
          </a-button>
        </a-form-item>
      </a-form>
    )
  },
}

export default Form.create()(HorizontalLoginForm)
</script>




