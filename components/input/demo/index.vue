<script>
import Basic from './basic';
import AutosizeTextarea from './autosize-textarea';
import Presuffix from './presuffix';
import SearchInput from './search-input';
import Size from './size';
import Group from './group';
import TextArea from './textarea';
import AllowClear from './allowClear';
import PasswordInput from './password-input';
import Addon from './addon';
import Tooltip from './tooltip';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Input 输入框
          通过鼠标或键盘输入内容，是最基础的表单域的包装。
## 何时使用
- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。
          ## 代码演示`,
  us: `# Input
          A basic widget for getting the user input is a text field.
Keyboard and mouse can be used for providing or changing data.
## When To Use
- A user input in a form field is needed.
- A search input is required.
## Examples `,
};
export default {
  category: 'Components',
  subtitle: '输入框',
  type: 'Data Entry',
  title: 'Input',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <AutosizeTextarea />
        <Presuffix />
        <SearchInput />
        <Size />
        <Group />
        <TextArea />
        <Addon />
        <Tooltip />
        <AllowClear />
        <PasswordInput />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
<style></style>
