<script>
import Async from './async';
import Basic from './basic';
import ConfirmPromise from './confirm-promise';
import Confirm from './confirm';
import Footer from './footer';
import Info from './info';
import Locale from './locale';
import Manual from './manual';
import Position from './position';
import ButtonProps from './button-props';
import ConfirmRouter from './confirm-router';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Modal 对话框
          模态对话框。
## 何时使用
需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 \`Modal\` 在当前页面正中打开一个浮层，承载相应的操作。
另外当需要一个简洁的确认框询问用户时，可以使用 \`Modal.confirm()\` 等语法糖方法。
          ## 代码演示`,
  us: `# Modal
          Modal dialogs.
## When To Use
When requiring users to interact with the application, but without jumping to a new page and interrupting
the user's workflow, you can use \`Modal\` to create a new floating layer over the current page to get user
feedback or display information.
Additionally, if you need show a simple confirmation dialog, you can use \`antd.Modal.confirm()\`,
and so on.
## Examples
`,
};
export default {
  type: 'Feedback',
  category: 'Components',
  subtitle: '对话框',
  title: 'Modal',
  render() {
    return (
      <div id="components-modal-demo">
        <md cn={md.cn} us={md.us} />
        <Async />
        <Basic />
        <ConfirmPromise />
        <Confirm />
        <Footer />
        <Info />
        <Locale />
        <Manual />
        <Position />
        <ButtonProps />
        <ConfirmRouter />
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
#components-modal-demo .ant-btn {
  margin-right: 8px;
}
</style>
