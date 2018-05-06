<cn>
#### 动态增减表单项
动态增加、减少表单项。
</cn>

<us>
#### Dynamic Form Item
Add or remove form items dynamically.
</us>

```html
<script>
import { Form } from 'vue-antd-ui'

let uuid = 0
const DynamicFieldSet = {
  methods: {
    remove  (k) {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      // We need at least one passenger
      if (keys.length === 1) {
        return
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      })
    },

    add  () {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(uuid)
      uuid++
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      })
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

  render () {
    const { getFieldDecorator, getFieldValue } = this.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    }
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      return (
        <a-form-item
          {...{ props: (index === 0 ? formItemLayout : formItemLayoutWithOutLabel) }}
          label={index === 0 ? 'Passengers' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            }],
          })(
            <a-input placeholder='passenger name' style={{ width: '60%', marginRight: '8px' }} />
          )}
          {keys.length > 1 ? (
            <a-icon
              class='dynamic-delete-button'
              type='minus-circle-o'
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </a-form-item>
      )
    })
    return (
      <a-form onSubmit={this.handleSubmit}>
        {formItems}
        <a-form-item {...{ props: formItemLayoutWithOutLabel }}>
          <a-button type='dashed' onClick={this.add} style={{ width: '60%' }}>
            <a-icon type='plus' /> Add field
          </a-button>
        </a-form-item>
        <a-form-item {...{ props: formItemLayoutWithOutLabel }}>
          <a-button type='primary' htmlType='submit'>Submit</a-button>
        </a-form-item>
      </a-form>
    )
  },
}

export default Form.create()(DynamicFieldSet)
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all .3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

```



