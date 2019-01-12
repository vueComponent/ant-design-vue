<cn>
#### 水平登录栏
水平登录栏，常用在顶部导航栏中。
</cn>

<us>
#### Horizontal Login Form
Horizontal login form is often used in navigation bar.
</us>


<template>
<a-form layout='inline' @submit="handleSubmit" :form="form">
  <a-form-item
    :validateStatus="userNameError() ? 'error' : ''"
    :help="userNameError() || ''"
  >
    <a-input
      placeholder='Username'
      v-decorator="[
        'userName',
        {rules: [{ required: true, message: 'Please input your username!' }]}
      ]"
    >
      <a-icon slot="prefix" type='user' style="color:rgba(0,0,0,.25)"/>
    </a-input>
  </a-form-item>
  <a-form-item
    :validateStatus="passwordError() ? 'error' : ''"
    :help="passwordError() || ''"
  >
    <a-input
      v-decorator="[
        'password',
        {rules: [{ required: true, message: 'Please input your Password!' }]}
      ]"
      type='password'
      placeholder='Password'
    >
      <a-icon slot="prefix" type='lock' style="color:rgba(0,0,0,.25)"/>
    </a-input>
  </a-form-item>
  <a-form-item>
    <a-button
      type='primary'
      htmlType='submit'
      :disabled="hasErrors(form.getFieldsError())"
    >
      Log in
    </a-button>
  </a-form-item>
</a-form>
</template>

<script>
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
  data () {
    return {
      hasErrors,
      form: this.$form.createForm(this),
    };
  },
  mounted () {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },
  methods: {
    // Only show error after a field is touched.
    userNameError () {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('userName') && getFieldError('userName');
    },
    // Only show error after a field is touched.
    passwordError () {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('password') && getFieldError('password');
    },
    handleSubmit  (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
  },
};
</script>





