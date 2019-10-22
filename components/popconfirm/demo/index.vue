<script>
import Basic from './basic.md';
import Local from './local.md';
import Placement from './placement.md';
import DynamicTrigger from './dynamic-trigger.md';
import Icon from './icon.md';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Popconfirm

  点击元素，弹出气泡式的确认框。

  ## 何时使用

  目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。

和 'confirm' 弹出的全屏居中模态对话框相比，交互形式更轻量。
            ## 代码演示`,
  us: `# Popconfirm

  A simple and compact confirmation dialog of an action.

  # When To Use

  A simple and compact dialog used for asking for user confirmation.

  The difference with the 'confirm' modal dialog is that it's more lightweight than the static popped full-screen confirm modal.
  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '气泡确认框',
  type: 'Feedback',
  title: 'Popconfirm',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Local />
        <Placement />
        <DynamicTrigger />
        <Icon />
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
