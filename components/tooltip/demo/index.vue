<script>
import Basic from './basic.md';
import ArrowPointAtCenter from './arrow-point-at-center.md';
import AutoAdjustOverflow from './auto-adjust-overflow.md';
import Placement from './placement.md';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Tooltip

  简单的文字提示气泡框。

  ## 何时使用

  鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。

可用来代替系统默认的 'title' 提示，提供一个'按钮/文字/操作'的文案解释。
            ## 代码演示`,
  us: `# Tooltip

  A simple text popup tip.

  # When To Use

  - The tip is shown on mouse enter, and is hidden on mouse leave. The Tooltip doesn't support complex text or operations.
  - To provide an explanation of a 'button/text/operation'. It's often used instead of the html 'title' attribute.
  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '文字提示',
  type: 'Data Display',
  title: 'Tooltip',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <br />
        <Basic />
        <br />
        <Placement />
        <br />
        <ArrowPointAtCenter />
        <br />
        <AutoAdjustOverflow />
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
