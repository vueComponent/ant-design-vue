<cn>
#### 表单联动
使用 `setFieldsValue` 来动态设置其他控件的值。
</cn>

<us>
#### Coordinated Controls
Use `setFieldsValue` to set other control's value programmaticly.
</us>


<script>
import { Form } from 'vue-antd-ui'

const CoordinatedForm = {
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleSelectChange (value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      })
    },
  },

  render () {
    const { getFieldDecorator } = this.form
    return (
      <a-form onSubmit={this.handleSubmit}>
        <a-form-item
          label='Note'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('note', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(
            <a-input />
          )}
        </a-form-item>
        <a-form-item
          label='Gender'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select your gender!' }],
          })(
            <a-select
              placeholder='Select a option and change input text above'
              onChange={this.handleSelectChange}
            >
              <a-select-option value='male'>male</a-select-option>
              <a-select-option value='female'>female</a-select-option>
            </a-select>
          )}
        </a-form-item>
        <a-form-item
          wrapperCol={{ span: 12, offset: 5 }}
        >
          <a-button type='primary' htmlType='submit'>
            Submit
          </a-button>
        </a-form-item>
      </a-form>
    )
  },
}

export default Form.create()(CoordinatedForm)
</script>




