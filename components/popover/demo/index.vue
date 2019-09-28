<script>
import Basic from './basic';
import ArrowCenter from './arrow-point-at-center';
import Control from './control';
import Placement from './placement';
import TriggerType from './triggerType';
import HoverWithClick from './hover-with-click';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Popover

  点击/鼠标移入元素，弹出气泡式的卡片浮层。

## 何时使用

当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。

和 \`Tooltip\` 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。
            ## 代码演示`,
  us: `# Popover

  The floating card popped by clicking or hovering.

## When To Use

A simple popup menu to provide extra information or operations.

Comparing with \`Tooltip\`, besides information \`Popover\` card can also provide action elements like links and buttons.
## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '气泡卡片',
  type: 'Data Display',
  title: 'Popover',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <ArrowCenter />
        <Control />
        <Placement />
        <TriggerType />
        <HoverWithClick />
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
