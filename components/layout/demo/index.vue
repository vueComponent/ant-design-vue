<script>
import Basic from './basic';
import CustomTrigger from './custom-trigger';
import FixedSider from './fixed-sider';
import Fixed from './fixed';
import Responsive from './responsive';
import Side from './side';
import TopSide2 from './top-side-2';
import TopSide from './top-side';
import Top from './top';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 布局
  协助进行页面级整体布局。

## 设计规则

### 尺寸

一级导航项偏左靠近 logo 放置，辅助菜单偏右放置。

- 顶部导航（大部分系统）：一级导航高度 \`64px\`，二级导航 \`48px\`。
- 顶部导航（展示类页面）：一级导航高度 \`80px\`，二级导航 \`56px\`。
- 顶部导航高度的范围计算公式为：\`48+8n\`。
- 侧边导航宽度的范围计算公式：\`200+8n\`。

### 交互

- 一级导航和末级的导航需要在可视化的层面被强调出来；
- 当前项应该在呈现上优先级最高；
- 当导航收起的时候，当前项的样式自动赋予给它的上一个层级；
- 左侧导航栏的收放交互同时支持手风琴和全展开的样式，根据业务的要求进行适当的选择。

### 视觉

导航样式上需要根据信息层级合理的选择样式：

- **大色块强调**

  建议用于底色为深色系时，当前页面父级的导航项。

- **高亮火柴棍**

  当导航栏底色为浅色系时使用，可用于当前页面对应导航项，建议尽量在导航路径的最终项使用。

- **字体高亮变色**

  从可视化层面，字体高亮的视觉强化力度低于大色块，通常在当前项的上一级使用。

- **字体放大**

  \`12px\`、\`14px\` 是导航的标准字号，14 号字体用在一、二级导航中。字号可以考虑导航项的等级做相应选择。

## 组件概述

- \`Layout\`：布局容器，其下可嵌套 \`Header\` \`Sider\` \`Content\` \`Footer\` 或 \`Layout\` 本身，可以放在任何父容器中。
- \`Header\`：顶部布局，自带默认样式，其下可嵌套任何元素，只能放在 \`Layout\` 中。
- \`Sider\`：侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 \`Layout\` 中。
- \`Content\`：内容部分，自带默认样式，其下可嵌套任何元素，只能放在 \`Layout\` 中。
- \`Footer\`：底部布局，自带默认样式，其下可嵌套任何元素，只能放在 \`Layout\` 中。

> 注意：采用 flex 布局实现，请注意[浏览器兼容性](http://caniuse.com/#search=flex)问题。

        ## 代码演示`,
  us: `# Layout
  Handling the overall layout of a page.

## Specification

### Size

The first level navigation is inclined left near a logo, and the secondary menu is inclined right.

- Top Navigation (almost systems): the height of the first level navigation \`64px\`, the second level navigation \`48px\`.
- Top Navigation(contents page): the height of the first level navigation \`80px\`, the second level navigation \`56px\`.
- Calculation formula of a top navigation: \`48+8n\`.
- Calculation formula of an aside navigation: \`200+8n\`.

### Interaction rules

- The first level navigation and the last level navigation should be distinguishable by visualization;
- The current item should have the highest priority of visualization;
- When the current navigation item is collapsed, the style of the current navigation item is applied to its parent level;
- The left side navigation bar has support for both the accordion and expanding styles; you can choose the one that fits your case the best.

## Visualization rules

 Style of a navigation should conform to its level.

- **Emphasis by colorblock**

  When background color is a deep color, you can use this pattern for the parent level navigation item of the current page.

- **The highlight match stick**

  When background color is a light color, you can use this pattern for the current page navigation item; we recommend using it for the last item of the navigation path.

- **Highlighted font**

  From the visualization aspect, a highlighted font is stronger than colorblock; this pattern is often used for the parent level of the current item.

- **Enlarge the size of the font**

  \`12px\`, \`14px\` is a standard font size of navigations, \`14px\` is used for the first and the second level of the navigation. You can choose an appropriate font size regarding the level of your navigation.

## Component Overview

- \`Layout\`: The layout wrapper, in which \`Header\` \`Sider\` \`Content\` \`Footer\` or \`Layout\` itself can be nested, and can be placed in any parent container.
- \`Header\`: The top layout with the default style, in which any element can be nested, and must be placed in \`Layout\`.
- \`Sider\`: The sidebar with default style and basic functions, in which any element can be nested, and must be placed in \`Layout\`.
- \`Content\`: The content layout with the default style, in which any element can be nested, and must be placed in \`Layout\`.
- \`Footer\`: The bottom layout with the default style, in which any element can be nested, and must be placed in \`Layout\`.

> Based on \`flex layout\`, please pay attention to the [compatibility](http://caniuse.com/#search=flex).

  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '布局',
  type: 'Layout',
  cols: 1,
  title: 'Layout',
  props: {
    iframeName: String,
  },
  provide() {
    return {
      iframeDemo: !this.iframeName
        ? {
            'fixed-sider': '/iframe/layout/#fixed-sider',
            'fixed-header': '/iframe/layout/#fixed-header',
            sider: '/iframe/layout/#sider',
          }
        : {},
    };
  },
  render() {
    const iframeName = this.iframeName;
    if (iframeName === 'fixed-sider') {
      return <FixedSider />;
    } else if (iframeName === 'fixed-header') {
      return <Fixed />;
    } else if (iframeName === 'sider') {
      return <Side />;
    }
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <CustomTrigger />
        <TopSide2 />
        <TopSide />
        <Top />
        <Responsive />
        <FixedSider />
        <Fixed />
        <Side />
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
