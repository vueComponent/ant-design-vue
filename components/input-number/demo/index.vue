<script>
import Basic from './basic.md';
import Disabled from './disabled.md';
import Digit from './digit.md';
import Formatter from './formatter.md';
import Size from './size.md';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 数字输入框
  通过鼠标或键盘，输入范围内的数值。
  ## 何时使用
  当需要获取标准数值时。
        ## 代码演示`,
  us: `# InputNumber
  Enter a number within certain range with the mouse or keyboard.
  ## When To Use
  When a numeric value needs to be provided.
  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '数字输入框',
  type: 'Data Entry',
  title: 'InputNumber',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <br />
        <Basic />
        <br />
        <Size />
        <br />
        <Disabled />
        <br />
        <Digit />
        <br />
        <Formatter />
        <br />
        <api>
          <template slot="cn">
            <CN />
          </template>
          <US />
        </api>
      </div>
    );
  },
};
</script>
