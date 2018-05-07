<script>

import AdvancedSearch from './advanced-search'
// import Coordinated from './coordinated'
// import CustomizedFormControls from './customized-form-controls'
// import DynamicFormItem from './dynamic-form-item'
// import DynamicRule from './dynamic-rule'
// import FormInModal from './form-in-modal'
// import GlobalState from './global-state'
// import HorizontalLogin from './horizontal-login'
// import Layout from './layout'
// import NormalLogin from './normal-login'
// import Register from './register'
// import TimeRelatedControls from './time-related-controls'
// import ValidateOther from './validate-other'
// import ValidateStatic from './validate-static'
// import WithoutFormCreate from './without-form-create'

import CN from './../index.zh-CN'
import US from './../index.en-US'

const md = {
  cn: `# Form 表单
           具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。

## 表单

我们为 \`form\` 提供了以下三种排列方式：

- 水平排列：标签和表单控件水平排列；（默认）
- 垂直排列：标签和表单控件上下垂直排列；
- 行内排列：表单项水平行内排列。

## 表单域

表单一定会包含表单域，表单域可以是输入控件，标准表单域，标签，下拉菜单，文本域等。

这里我们封装了表单域 \`<Form.Item />\` 。

**注意：** 如果使用 \`Form.create\` 处理表单使其具有自动收集数据并校验的功能，建议使用\`jsx\`
## 代码演示
        `,
  us: `# Form
           Form is used to collect, validate, and submit the user input, usually contains various form items including checkbox, radio, input, select, and etc.

## Form

You can align the controls of a \`form\` using the \`layout\` prop：

- \`horizontal\`：to horizontally align the \`label\`s and controls of the fields. (Default)
- \`vertical\`：to vertically align the \`label\`s and controls of the fields.
- \`inline\`：to render form fields in one line.

## Form fields

A form consists of one or more form fields whose type includes input, textarea, checkbox, radio, select, tag, and more.
A form field is defined using \`<Form.Item />\`.

**Note:** If you use \`Form.create\` to process forms with automatic data collection and validation, we recommend using \`jsx\`
## Examples
        `,
}

export default {
  category: 'Components',
  subtitle: '表单',
  type: 'Data Entry',
  cols: 1,
  title: 'Form',
  render () {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <AdvancedSearch />
        {/* <Coordinated />
        <CustomizedFormControls />
        <DynamicFormItem />
        <DynamicRule />
        <FormInModal />
        <GlobalState />
        <HorizontalLogin />
        <Layout />
        <NormalLogin />
        <Register />
        <TimeRelatedControls />
        <ValidateStatic />
        <WithoutFormCreate />
        <ValidateOther />
        */}
        <api>
          <CN slot='cn' />
          <US />
        </api>
      </div>
    )
  },
}
</script>
