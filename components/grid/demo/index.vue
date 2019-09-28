<script>
import Basic from './basic';
import FlexAlign from './flex-align';
import FlexOrder from './flex-order';
import Flex from './flex';
import Gutter from './gutter';
import Offset from './offset';
import ResponsiveMore from './responsive-more';
import Responsive from './responsive';
import Sort from './sort';
import Playfround from './playfround';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Grid 栅格
          24 栅格系统。
          ## 设计理念
          `,
  us: `# Grid
24 Grids System。
## Design concept`,
};
const md2 = {
  cn: `
  在多数业务情况下，Ant Design需要在设计区域内解决大量信息收纳的问题，因此在 12 栅格系统的基础上，我们将整个设计建议区域按照 24 等分的原则进行划分。
划分之后的信息区块我们称之为『盒子』。建议横向排列的盒子数量最多四个，最少一个。『盒子』在整个屏幕上占比见上图。设计部分基于盒子的单位定制盒子内部的排版规则，以保证视觉层面的舒适感。
## 概述
布局的栅格化系统，我们是基于行（row）和列（col）来定义信息区块的外部框架，以保证页面的每个区域能够稳健地排布起来。下面简单介绍一下它的工作原理：
- 通过\`row\`在水平方向建立一组\`column\`（简写col）
- 你的内容应当放置于\`col\`内，并且，只有\`col\`可以作为\`row\`的直接元素
- 栅格系统中的列是指1到24的值来表示其跨越的范围。例如，三个等宽的列可以使用\`.col-8\`来创建
- 如果一个\`row\`中的\`col\`总和超过 24，那么多余的\`col\`会作为一个整体另起一行排列
## Flex 布局
我们的栅格化系统支持 Flex 布局，允许子元素在父节点内的水平对齐方式 - 居左、居中、居右、等宽排列、分散排列。子元素与子元素之间，支持顶部对齐、垂直居中对齐、底部对齐的方式。同时，支持使用 order 来定义元素的排列顺序。
Flex 布局是基于 24 栅格来定义每一个『盒子』的宽度，但不拘泥于栅格。
          ## 代码演示
  `,
  us: `
  In most business situations, Ant Design needs to solve a lot of information storage problems within the design area, so based on 12 Grids System, we divided the design area into 24 aliquots.

We name the divided area 'box'. We suggest four boxes for horizontal arrangement at most, one at least. Boxes are proportional to the entire screen as shown in the picture above. To ensure a high level of visual comfort, we customize the typography inside of the box based on the box unit.

## Outline

In the grid system, we define the frame outside the information area based on \`row\` and \`column\`, to ensure that every area can have stable arrangement.

Following is a brief look at how it works:

- Establish a set of \`column\` in the horizontal space defined by \`row\` (abbreviated col)
- Your content elements should be placed directly in the \`col\`, and only \`col\` should be placed directly in \`row\`
- The column grid system is a value of 1-24 to represent its range spans. For example, three columns of equal width can be created by \`.col-8\` (\`span=8\`).
- If the sum of \`col\` spans in a \`row\` are more than 24, then the overflowing \`col\` as a whole will start a new line arrangement.

## Flex layout
Our grid systems support Flex layout to allow the elements within the parent to be aligned horizontally - left, center, right, wide arrangement, and decentralized arrangement. The Grid system also supports vertical alignment - top aligned, vertically centered, bottom-aligned. You can also define the order of elements by using \`order\`.
Flex layout uses a 24 grid layout to define the width of each "box", but does not rigidly adhere to the grid layout.
## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '栅格',
  type: 'Layout',
  zhType: '布局',
  cols: 1,
  title: 'Grid',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <div class="grid-demo">
          <div class="ant-row demo-row">
            <div class="ant-col-24 demo-col demo-col-1">100%</div>
          </div>
          <div class="ant-row demo-row">
            <div class="ant-col-6 demo-col demo-col-2">25%</div>
            <div class="ant-col-6 demo-col demo-col-3">25%</div>
            <div class="ant-col-6 demo-col demo-col-2">25%</div>
            <div class="ant-col-6 demo-col demo-col-3">25%</div>
          </div>
          <div class="ant-row demo-row">
            <div class="ant-col-8 demo-col demo-col-4">33.33%</div>
            <div class="ant-col-8 demo-col demo-col-5">33.33%</div>
            <div class="ant-col-8 demo-col demo-col-4">33.33%</div>
          </div>
          <div class="ant-row demo-row">
            <div class="ant-col-12 demo-col demo-col-1">50%</div>
            <div class="ant-col-12 demo-col demo-col-3">50%</div>
          </div>
          <div class="ant-row demo-row">
            <div class="ant-col-16 demo-col demo-col-4">66.66%</div>
            <div class="ant-col-8 demo-col demo-col-5">33.33%</div>
          </div>
        </div>
        <md cn={md2.cn} us={md2.us} />
        <div id="components-grid-demo-all">
          <Basic />
          <FlexAlign />
          <FlexOrder />
          <Flex />
          <Gutter />
          <Offset />
          <ResponsiveMore />
          <Responsive />
          <Sort />
          <Playfround />
        </div>
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
