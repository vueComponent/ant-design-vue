<cn>
#### 自定义校验
我们提供了 `validateStatus` `help` `hasFeedback` 等属性，你可以不需要使用 `Form.create` 和 `getFieldDecorator`，自己定义校验的时机和内容。
1. `validateStatus`: 校验状态，可选 'success', 'warning', 'error', 'validating'。
2. `hasFeedback`：用于给输入框添加反馈图标。
3. `help`：设置校验文案。
</cn>

<us>
#### Customized Validation
We provide properties like `validateStatus` `help` `hasFeedback` to customize your own validate status and message, without using `Form.create` and `getFieldDecorator`.
1. `validateStatus`: validate status of form components which could be 'success', 'warning', 'error', 'validating'.
2. `hasFeedback`: display feed icon of input control
3. `help`: display validate message.
</us>

```html
<template>
  <a-form>
    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Fail'
      validateStatus='error'
      help='Should be combination of numbers & alphabets'
    >
      <a-input placeholder='unavailable choice' id='error' />
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Warning'
      validateStatus='warning'
    >
      <a-input placeholder='Warning' id='warning' />
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Validating'
      hasFeedback
      validateStatus='validating'
      help='The information is being validated...'
    >
      <a-input placeholder="I'm the content is being validated" id='validating' />
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Success'
      hasFeedback
      validateStatus='success'
    >
      <a-input placeholder="I'm the content" id='success' />
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Warning'
      hasFeedback
      validateStatus='warning'
    >
      <a-input placeholder='Warning' id='warning' />
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Fail'
      hasFeedback
      validateStatus='error'
      help='Should be combination of numbers & alphabets'
    >
      <a-input placeholder='unavailable choice' id='error' />
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Success'
      hasFeedback
      validateStatus='success'
    >
      <a-date-picker style="width: 100%" />
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Warning'
      hasFeedback
      validateStatus='warning'
    >
      <a-time-picker style="width: 100%" />
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Error'
      hasFeedback
      validateStatus='error'
    >
      <a-select defaultValue='1'>
        <a-select-option value='1'>Option 1</a-select-option>
        <a-select-option value='2'>Option 2</a-select-option>
        <a-select-option value='3'>Option 3</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Validating'
      hasFeedback
      validateStatus='validating'
      help='The information is being validated...'
    >
      <a-cascader :defaultValue="['1']" :options="[]" />
    </a-form-item>

    <a-form-item
      label='inline'
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-col :span="11">
        <a-form-item validateStatus='error' help='Please select the correct date'>
          <a-date-picker style="width: 100%"/>
        </a-form-item>
      </a-col>
      <a-col :span="2">
        <span :style="{ display: 'inline-block', width: '100%', textAlign: 'center' }">
          -
        </span>
      </a-col>
      <a-col :span="11">
        <a-form-item>
          <a-date-picker style="width: 100%"/>
        </a-form-item>
      </a-col>
    </a-form-item>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      label='Success'
      hasFeedback
      validateStatus='success'
    >
      <a-input-number style="width: 100%" />
    </a-form-item>
  </a-form>
</template>
<script>
export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }
  },
}
</script>
```



