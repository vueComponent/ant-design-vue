<cn>
#### 注册新用户
用户填写必须的信息以注册新用户。
</cn>

<us>
#### Registration
Fill in this form to create a new account for you.
</us>


<script>
import { Form } from 'vue-antd-ui'

const residences = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}]

const RegistrationForm = {
  data () {
    return {
      confirmDirty: false,
      autoCompleteResult: [],
    }
  },
  methods: {
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleConfirmBlur  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword  (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!')
      } else {
        callback()
      }
    },
    validateToNextPassword  (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    handleWebsiteChange  (value) {
      let autoCompleteResult
      if (!value) {
        autoCompleteResult = []
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
      }
      this.autoCompleteResult = autoCompleteResult
    },
  },

  render () {
    const { getFieldDecorator } = this.form
    const { autoCompleteResult } = this

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    }
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <a-select style={{ width: '70px' }}>
        <a-select-option value='86'>+86</a-select-option>
        <a-select-option value='87'>+87</a-select-option>
      </a-select>
    )

    const websiteOptions = autoCompleteResult.map(website => (
      <a-select-option key={website}>{website}</a-select-option>
    ))

    return (
      <a-form onSubmit={this.handleSubmit}>
        <a-form-item
          {...{ props: formItemLayout }}
          label='E-mail'
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <a-input />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='Password'
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <a-input type='password' />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='Confirm Password'
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <a-input type='password' onBlur={this.handleConfirmBlur} />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label={(
            <span>
              Nickname&nbsp;
              <a-tooltip title='What do you want others to call you?'>
                <a-icon type='question-circle-o' />
              </a-tooltip>
            </span>
          )}
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          })(
            <a-input />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='Habitual Residence'
        >
          {getFieldDecorator('residence', {
            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
            rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
          })(
            <a-cascader options={residences} />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='Phone Number'
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <a-input addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='Website'
        >
          {getFieldDecorator('website', {
            rules: [{ required: true, message: 'Please input website!' }],
          })(
            <a-auto-complete
              dataSource={websiteOptions}
              onChange={this.handleWebsiteChange}
              placeholder='website'
            >
              <a-input />
            </a-auto-complete>
          )}
        </a-form-item>
        <a-form-item
          {...{ props: formItemLayout }}
          label='Captcha'
          extra='We must make sure that your are a human.'
        >
          <a-row gutter={8}>
            <a-col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: 'Please input the captcha you got!' }],
              })(
                <a-input />
              )}
            </a-col>
            <a-col span={12}>
              <a-button>Get captcha</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item {...{ props: tailFormItemLayout }}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <a-checkbox>I have read the <a href=''>agreement</a></a-checkbox>
          )}
        </a-form-item>
        <a-form-item {...{ props: tailFormItemLayout }}>
          <a-button type='primary' htmlType='submit'>Register</a-button>
        </a-form-item>
      </a-form>
    )
  },
}

export default Form.create()(RegistrationForm)
</script>




