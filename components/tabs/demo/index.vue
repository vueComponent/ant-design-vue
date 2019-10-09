<script>
import Basic from './basic';
import CardTop from './card-top';
import Card from './card';
import CustomAddTrigger from './custom-add-trigger';
import Disabled from './disabled';
import EditableCard from './editable-card';
import Extra from './extra';
import Icon from './icon';
import Position from './position';
import Size from './size';
import Slide from './slide';
// import CustomTabBar from './custom-tab-bar';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Tabs 标签页

    选项卡切换组件。

## 何时使用

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

Ant Design 依次提供了三级选项卡，分别用于不同的场景。

- 卡片式的页签，提供可关闭的样式，常用于容器顶部。
- 标准线条式页签，用于容器内部的主功能切换，这是最常用的 Tabs。
- [RadioButton](/ant-design/components/radio-cn/) 可作为更次级的页签来使用。

    ## 代码演示`,
  us: `# Tabs

Tabs make it easy to switch between different views.

### When To Use

Ant Design has 3 types of Tabs for different situations.

- Card Tabs: for managing too many closeable views.
- Normal Tabs: for functional aspects of a page.
- [RadioButton](/ant-design/components/radio/): for secondary tabs.
    ## Examples `,
};
export default {
  category: 'Components',
  subtitle: '标签页',
  type: 'Data Display',
  title: 'Tabs',
  cols: 1,
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Disabled />
        <Icon />
        <Slide />
        <Extra />
        <Size />
        <Position />
        <Card />
        <EditableCard />
        <CardTop />
        <CustomAddTrigger />
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
