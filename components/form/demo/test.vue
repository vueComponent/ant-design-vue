<template>
<a-form layout='inline' @submit="handleSubmit" :autoFormCreate="(form)=>{this.form = form}">
  <template v-if="form">
    <a-form-item
      :validateStatus="userNameError() ? 'error' : ''"
      :help="userNameError() || ''"
      fieldDecoratorId="userName"
      :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your username!' }]}"
    >
      <a-input placeholder='Username'>
        <a-icon slot="prefix" type='user' style="color:rgba(0,0,0,.25)"/>
      </a-input>
    </a-form-item>
    <a-form-item
      :validateStatus="passwordError() ? 'error' : ''"
      :help="passwordError() || ''"
      fieldDecoratorId="password"
      :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your Password!' }]}"
    >
        <a-input type='password' placeholder='Password'>
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
  </template>
</a-form>
</template>

<script>
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
export default {
  data () {
    return {
      hasErrors,
      form: null,
    }
  },
  mounted () {

  },
  watch: {
    form (val) {
      this.$nextTick(() => {
        // To disabled submit button at the beginning.
        this.form.validateFields()
      })
    },
  },
  methods: {
    // Only show error after a field is touched.
    userNameError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('userName') && getFieldError('userName')
    },
    // Only show error after a field is touched.
    passwordError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('password') && getFieldError('password')
    },
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
  },
}
</script>
