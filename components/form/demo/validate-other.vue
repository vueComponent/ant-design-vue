<cn>
#### 校验其他组件
以上演示没有出现的表单控件对应的校验演示。
</cn>

<us>
#### Other Form Controls
Demostration for validataion configuration for form controls which are not show in the above demos.
</us>


<script>
import { Form } from 'vue-antd-ui'

const Demo = {
  methods: {
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    normFile  (e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
  },

  render () {
    const { getFieldDecorator } = this.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <a-form id='components-form-demo-validate-other' onSubmit={this.handleSubmit}>
        <a-form-item
          {...{ props: formItemLayout }}
          label='Plain Text'
        >
          <span class='ant-form-text'>China</span>
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='Select'
          hasFeedback
        >
          {getFieldDecorator('select', {
            rules: [
              { required: true, message: 'Please select your country!' },
            ],
          })(
            <a-select placeholder='Please select a country'>
              <a-select-option value='china'>China</a-select-option>
              <a-select-option value='use'>U.S.A</a-select-option>
            </a-select>
          )}
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='Select[multiple]'
        >
          {getFieldDecorator('select-multiple', {
            rules: [
              { required: true, message: 'Please select your favourite colors!', type: 'array' },
            ],
          })(
            <a-select mode='multiple' placeholder='Please select favourite colors'>
              <a-select-option value='red'>Red</a-select-option>
              <a-select-option value='green'>Green</a-select-option>
              <a-select-option value='blue'>Blue</a-select-option>
            </a-select>
          )}
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='InputNumber'
        >
          {getFieldDecorator('input-number', { initialValue: 3 })(
            <a-input-number min={1} max={10} />
          )}
          <span class='ant-form-text'> machines</span>
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='Switch'
        >
          {getFieldDecorator('switch', { valuePropName: 'checked' })(
            <a-switch />
          )}
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='Slider'
        >
          {getFieldDecorator('slider')(
            <a-slider marks={{ 0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F' }} />
          )}
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='Radio.Group'
        >
          {getFieldDecorator('radio-group')(
            <a-radio-group>
              <a-radio value='a'>item 1</a-radio>
              <a-radio value='b'>item 2</a-radio>
              <a-radio value='c'>item 3</a-radio>
            </a-radio-group>
          )}
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='Radio.Button'
        >
          {getFieldDecorator('radio-button')(
            <a-radio-group>
              <a-radio-button value='a'>item 1</a-radio-button>
              <a-radio-button value='b'>item 2</a-radio-button>
              <a-radio-button value='c'>item 3</a-radio-button>
            </a-radio-group>
          )}
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='Rate'
        >
          {getFieldDecorator('rate', {
            initialValue: 3.5,
          })(
            <a-rate allowHalf/>
          )}
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='Upload'
          extra='longgggggggggggggggggggggggggggggggggg'
        >
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <a-upload name='logo' action='/upload.do' listType='picture'>
              <a-button>
                <a-icon type='upload' /> Click to upload
              </a-button>
            </a-upload>
          )}
        </a-form-item>

        <a-form-item
          {...{ props: formItemLayout }}
          label='Dragger'
        >
          <div class='dropbox'>
            {getFieldDecorator('dragger', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <a-upload-dragger name='files' action='/upload.do'>
                <p class='ant-upload-drag-icon'>
                  <a-icon type='inbox' />
                </p>
                <p class='ant-upload-text'>Click or drag file to this area to upload</p>
                <p class='ant-upload-hint'>Support for a single or bulk upload.</p>
              </a-upload-dragger>
            )}
          </div>
        </a-form-item>

        <a-form-item
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <a-button type='primary' htmlType='submit'>Submit</a-button>
        </a-form-item>
      </a-form>
    )
  },
}

export default Form.create()(Demo)
</script>
<style>
#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}
</style>




