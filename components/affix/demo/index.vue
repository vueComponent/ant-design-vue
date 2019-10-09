<script>
import Basic from './basic';
import Onchange from './on-change';
import Target from './target';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Affix 固钉
          将页面元素钉在可视范围。
## 何时使用
当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。
页面可视范围过小时，慎用此功能以免遮挡页面内容。
          ## 代码演示`,
  us: `# Affix
          Make an element stick to viewport.
## When To Use
When user browses a long web page, some content need to stick to the viewport. This is common for menus and actions.
Please note that Affix should not cover other content on the page, especially when the size of the viewport is small.
## Examples `,
};
export default {
  category: 'Components',
  subtitle: '固钉',
  zhType: '导航',
  type: 'Navigation',
  title: 'Affix',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Onchange />
        <Target />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
