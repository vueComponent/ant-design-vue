<script>
import Basic from './basic';
import ContextMenu from './context-menu';
import DropdownButton from './dropdown-button';
import Event from './event';
import Item from './item';
import OverlayVisible from './overlay-visible';
import Placement from './placement';
import SubMenu from './sub-menu';
import Trigger from './trigger';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# 下拉菜单
        向下弹出的列表。
        ## 何时使用
        当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。
        ## 代码演示`,
  us: `# Dropdown
        A dropdown list.
        ## When To Use
        If there are too many operations to display, you can wrap them in a \`Dropdown\`. By clicking/hovering on the trigger, a dropdown menu should appear, which allows you to choose one option and execute relevant actions.
        ## Examples 
        `,
};
export default {
  category: 'Components',
  subtitle: '下拉菜单',
  type: 'Navigation',
  zhType: '导航',
  title: 'Dropdown',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <ContextMenu />
        <DropdownButton />
        <Event />
        <Item />
        <OverlayVisible />
        <Placement />
        <SubMenu />
        <Trigger />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
