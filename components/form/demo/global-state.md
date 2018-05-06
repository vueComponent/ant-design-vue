<cn>
#### 表单数据存储于上层组件
通过使用 `onFieldsChange` 与 `mapPropsToFields`，可以把表单的数据存储到上层组件。
**注意：**
`mapPropsToFields` 里面返回的表单域数据必须使用 `Form.createFormField` 包装。
上层组件传递的属性，必须在`Form.create({ props: ...})`的props中声明。
</cn>

<us>
#### Store Form Data into Upper Component
We can store form data into upper component.
**Note:** 
You must wrap field data with `Form.createFormField` in `mapPropsToFields`.
The properties passed by the upper component must be declared in the props of `Form.create({ props: ...})`.
</us>

```html
<script>
import { Form } from 'vue-antd-ui'

const CustomizedForm = Form.create({
  props: ['username'], // must declare like vue `props` https://vuejs.org/v2/api/#props
  onFieldsChange (instance, changedFields) {
    instance.$emit('change', changedFields)
  },
  mapPropsToFields (props) {
    return {
      username: Form.createFormField({
        ...props.username,
        value: props.username.value,
      }),
    }
  },
  onValuesChange (_, values) {
    console.log(values)
  },
})({
  render () {
    const { getFieldDecorator } = this.form
    return (
      <a-form layout='inline'>
        <a-form-item label='Username'>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Username is required!' }],
          })(<a-input />)}
        </a-form-item>
      </a-form>
    )
  },

})

export default {
  data () {
    return {
      fields: {
        username: {
          value: 'benjycui',
        },
      },
    }
  },
  methods: {
    handleFormChange (changedFields) {
      this.fields = { ...this.fields, ...changedFields }
    },
  },

  render () {
    const fields = this.fields
    return (
      <div id='components-form-demo-global-state'>
        <CustomizedForm {...{ props: fields }} onChange={this.handleFormChange} />
        <pre class='language-bash'>
          {JSON.stringify(fields, null, 2)}
        </pre>
      </div>
    )
  },
}
</script>
<style>
#components-form-demo-global-state .language-bash {
  max-width: 400px;
  border-radius: 6px;
  margin-top: 24px;
}
</style>
```



