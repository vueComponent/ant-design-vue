<script>
import Horizontal from './horizontal';
import InlineCollapsed from './inline-collapsed';
import Inline from './inline';
import SiderCurrent from './sider-current';
import SwitchMode from './switch-mode';
import Theme from './theme';
import Vertical from './vertical';
import Template from './template';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Menu 导航菜单
          为页面和功能提供导航的菜单列表。
## 何时使用
导航菜单是一个网站的灵魂，用户依赖导航在各个页面中进行跳转。一般分为顶部导航和侧边导航，顶部导航提供全局性的类目和功能，侧边导航提供多级结构来收纳和排列网站架构。
          ## 代码演示`,
  us: `# Menu
          Menu list of Navigation.
## When To Use
Navigation menu is important for a website, it helps users jump from one site section to another quickly. Mostly, it includes top navigation and side navigation. Top navigation provides all the category and functions of the website. Side navigation provides the Multi-level structure of the website.
## Examples`,
};
export default {
  category: 'Components',
  cols: 1,
  type: 'Navigation',
  title: 'Menu',
  subtitle: '导航菜单',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Horizontal />
        <Inline />
        <InlineCollapsed />
        <SiderCurrent />
        <Vertical />
        <Theme />
        <SwitchMode />
        <Template />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
<style></style>
