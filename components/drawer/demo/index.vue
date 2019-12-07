<script>
import BasicRight from './basic-right';
import Placement from './placement';
import UserProfile from './user-profile';
import MultiLevelDrawer from './multi-level-drawer';
import FormInDrawer from './form-in-drawer';
// import CustomPaging from './customPaging'
// import CustomArrows from './customArrows'

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

import '../style';

const md = {
  cn: `# Drawer 抽屉
        屏幕边缘滑出的浮层面板。

## 何时使用

抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到到原任务。

* 当需要一个附加的面板来控制父窗体内容，这个面板在需要时呼出。比如，控制界面展示样式，往界面中添加内容。
* 当需要在当前任务流中插入临时任务，创建或预览附加内容。比如展示协议条款，创建子对象。

       ## 代码演示
        `,
  us: `# Drawer
        Panel slides from screen edge.

## When To Use

A Drawer is a panel that is typically overlaid on top of a page and slides in from the side. It contains a set of information or actions. Since that user can interact with the Drawer without leaving the current page, tasks can be achieved more efficient within the same context.

* Use a Form to create or edit a set of information.
* Processing subtasks. When subtasks are too heavy for Popover and we still want to keep the subtasks in the context of the main task, Drawer comes very handy.
* When a same Form is needed in multiple places.
       ## Examples
        `,
};
export default {
  category: 'Components',
  type: 'Feedback',
  zhType: '反馈',
  title: 'Drawer',
  subtitle: '抽屉',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <BasicRight />
        <Placement />
        <FormInDrawer />
        <UserProfile />
        <MultiLevelDrawer />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
