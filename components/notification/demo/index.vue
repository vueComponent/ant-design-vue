<script>
import Basic from './basic';
import CustomIcon from './custom-icon';
import CustomStyle from './custom-style';
import Duration from './duration';
import Placement from './placement';
import WithBtn from './with-btn';
import WithIcon from './with-icon';
import Update from './update';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# 通知提醒框
全局展示通知提醒信息。
## 何时使用
在系统四个角显示通知提醒信息。经常用于以下情况：
- 较为复杂的通知内容。
- 带有交互的通知，给出用户下一步的行动点。
- 系统主动推送。

## 代码演示`,
  us: `# Notification
Display a notification message globally.
## When To Use
To display a notification message at any of the four corners of the viewport. Typically it can be
used in the following cases:
- A notification with complex content.
- A notification providing a feedback based on the user interaction. Or it may show some details
  about upcoming steps the user may have to follow.
- A notification that is pushed by the application.
## Examples `,
};
export default {
  category: 'Components',
  type: 'Feedback',
  noinstant: true,
  title: 'Notification',
  subtitle: '通知提醒框',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <CustomIcon />
        <CustomStyle />
        <Duration />
        <Placement />
        <WithBtn />
        <WithIcon />
        <Update />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
