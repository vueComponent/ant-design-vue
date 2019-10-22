<script>
import AdvancedSearch from './advanced-search';
import AdvancedSearchString from '!raw-loader!./advanced-search';
import Coordinated from './coordinated';
import CoordinatedString from '!raw-loader!./coordinated';
import CustomizedFormControls from './customized-form-controls';
import CustomizedFormControlsString from '!raw-loader!./customized-form-controls';
import DynamicFormItem from './dynamic-form-item';
import DynamicFormItemString from '!raw-loader!./dynamic-form-item';
import DynamicRule from './dynamic-rule';
import DynamicRuleString from '!raw-loader!./dynamic-rule';
import FormInModal from './form-in-modal';
import FormInModalString from '!raw-loader!./form-in-modal';
import GlobalState from './global-state';
import GlobalStateString from '!raw-loader!./global-state';
import VuexState from './vuex';
import VuexStateString from '!raw-loader!./vuex';
import HorizontalLogin from './horizontal-login';
import HorizontalLoginString from '!raw-loader!./horizontal-login';
import Layout from './layout';
import LayoutString from '!raw-loader!./layout';
import NormalLogin from './normal-login';
import NormalLoginString from '!raw-loader!./normal-login';
import Register from './register';
import RegisterString from '!raw-loader!./register';
import TimeRelatedControls from './time-related-controls';
import TimeRelatedControlsString from '!raw-loader!./time-related-controls';
import ValidateOther from './validate-other';
import ValidateOtherString from '!raw-loader!./validate-other';
import ValidateStatic from './validate-static';
import ValidateStaticString from '!raw-loader!./validate-static';
import WithoutFormCreate from './without-form-create';
import WithoutFormCreateString from '!raw-loader!./without-form-create';

import CN from '../index.zh-CN';
import US from '../index.en-US';

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


 ## 注意： 
1、如果使用 \`Form.create\` 处理表单使其具有自动收集数据并校验的功能，建议使用\`jsx\`。
2、如果不是使用Vue.use(Form)形式注册的\`Form\`组件，你需要自行将\`$form\`挂载到Vue原型上。
\`Vue.prototype.$form = Form\`


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

 ## Note:
1. If you use \`Form.create\` to process the form to have the ability to automatically collect data and verify it, it is recommended to use \`jsx\`.
2. If you are not using the \`Form\` component registered in Vue.use(Form) form, you need to mount \`$form\` to the Vue prototype yourself.
\`Vue.prototype.$form = Form\`

## Examples
        `,
};

export default {
  category: 'Components',
  subtitle: '表单',
  type: 'Data Entry',
  zhType: '数据录入',
  cols: 1,
  title: 'Form',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <demo-container code={CoordinatedString}>
          <Coordinated />
        </demo-container>
        <demo-container code={DynamicRuleString}>
          <DynamicRule />
        </demo-container>
        <demo-container code={HorizontalLoginString}>
          <HorizontalLogin />
        </demo-container>
        <demo-container code={LayoutString}>
          <Layout />
        </demo-container>
        <demo-container code={ValidateStaticString}>
          <ValidateStatic />
        </demo-container>
        <demo-container code={WithoutFormCreateString}>
          <WithoutFormCreate />
        </demo-container>

        <demo-container code={AdvancedSearchString}>
          <AdvancedSearch />
        </demo-container>
        <demo-container code={CustomizedFormControlsString}>
          <CustomizedFormControls />
        </demo-container>
        <demo-container code={DynamicFormItemString}>
          <DynamicFormItem />
        </demo-container>
        <demo-container code={FormInModalString}>
          <FormInModal />
        </demo-container>
        <demo-container code={GlobalStateString}>
          <GlobalState />
        </demo-container>
        <demo-container code={VuexStateString}>
          <VuexState />
        </demo-container>
        <demo-container code={NormalLoginString}>
          <NormalLogin />
        </demo-container>
        <demo-container code={RegisterString}>
          <Register />
        </demo-container>
        <demo-container code={TimeRelatedControlsString}>
          <TimeRelatedControls />
        </demo-container>
        <demo-container code={ValidateOtherString}>
          <ValidateOther />
        </demo-container>
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
<style>
.code-box-demo .ant-form:not(.ant-form-inline):not(.ant-form-vertical) {
  max-width: 600px;
}
.markdown.api-container table td:last-child {
  white-space: nowrap;
  word-wrap: break-word;
}
</style>
