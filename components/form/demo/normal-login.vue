<cn>
#### 登录框
普通的登录框，可以容纳更多的元素。
</cn>

<us>
#### Login Form
Normal login form which can contain more elements.
</us>


<script>
import { Form } from 'vue-antd-ui'

const NormalLoginForm = {
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
  },

  render () {
    const { getFieldDecorator } = this.form
    return (
      <a-form id='components-form-demo-normal-login' onSubmit={this.handleSubmit} class='login-form'>
        <a-form-item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <a-input prefix={<a-icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Username' />
          )}
        </a-form-item>
        <a-form-item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <a-input prefix={<a-icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
          )}
        </a-form-item>
        <a-form-item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <a-checkbox>Remember me</a-checkbox>
          )}
          <a class='login-form-forgot' href=''>Forgot password</a>
          <a-button type='primary' htmlType='submit' class='login-form-button'>
            Log in
          </a-button>
          Or <a href=''>register now!</a>
        </a-form-item>
      </a-form>
    )
  },
}

export default Form.create()(NormalLoginForm)
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>




