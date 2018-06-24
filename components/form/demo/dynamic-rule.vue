<cn>
#### 动态校验规则
根据不同情况执行不同的校验规则。
</cn>

<us>
#### Dynamic Rules
Perform different check rules according to different situations.
</us>


<template>
  <a-form :autoFormCreate="(form)=>{this.form = form}">
    <a-form-item
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      label='Name'
      fieldDecoratorId="username"
      :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your name' }]}"
    >
      <a-input placeholder='Please input your name' />
    </a-form-item>
    <a-form-item
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      label='Nickname'
      fieldDecoratorId="nickname"
      :fieldDecoratorOptions="{rules: [{ required: checkNick, message: 'Please input your nickname' }]}"
    >
      <a-input placeholder='Please input your nickname' />
    </a-form-item>
    <a-form-item
      :labelCol="formTailLayout.labelCol"
      :wrapperCol="formTailLayout.wrapperCol"
    >
      <a-checkbox
        :checked="checkNick"
        @change="handleChange"
      >
        Nickname is required
      </a-checkbox>
    </a-form-item>
    <a-form-item
      :labelCol="formTailLayout.labelCol"
      :wrapperCol="formTailLayout.wrapperCol"
    >
      <a-button type='primary' @click="check">Check</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
}
export default {
  data () {
    return {
      checkNick: false,
      formItemLayout,
      formTailLayout,
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
}
</script>





