<cn>
#### 表单布局
表单有三种布局。
</cn>

<us>
#### Form Layout
There are three layout for form: `horizontal`, `vertical`, `inline`.
</us>

```html
<template>
<div>
  <a-form :layout="formLayout">
    <a-form-item
      label='Form Layout'
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
    >
      <a-radio-group defaultValue='horizontal' @change="handleFormLayoutChange">
        <a-radio-button value='horizontal'>Horizontal</a-radio-button>
        <a-radio-button value='vertical'>Vertical</a-radio-button>
        <a-radio-button value='inline'>Inline</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label='Field A'
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
    >
      <a-input placeholder='input placeholder' />
    </a-form-item>
    <a-form-item
      label='Field B'
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
    >
      <a-input placeholder='input placeholder' />
    </a-form-item>
    <a-form-item
      :wrapperCol="buttonItemLayout.wrapperCol"
    >
      <a-button type='primary'>Submit</a-button>
    </a-form-item>
  </a-form>
</div>  
</template>

<script>
export default {
  data () {
    return {
      formLayout: 'horizontal',
    }
  },
  methods: {
    handleFormLayoutChange  (e) {
      this.formLayout = e.target.value
    },
  },
  computed: {
    formItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      } : {}
    },
    buttonItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? {
        wrapperCol: { span: 14, offset: 4 },
      } : {}
    },
  },
}
</script>
```



