<script>
import Hours from './12hours';
import Addon from './addon';
import Basic from './basic';
import Disabled from './disabled';
import HideColumn from './hide-column';
import IntervalOptions from './interval-options';
import Size from './size';
import Value from './value';
import Suffix from './suffix';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# TimePicker 时间选择框
          输入或选择时间的控件。
## 何时使用
当用户需要输入一个时间，可以点击标准输入框，弹出时间面板进行选择。
          ## 代码演示`,
  us: `# TimePicker
          To select/input a time.
## When To Use
By clicking the input box, you can select a time from a popup panel.
## Examples `,
};
export default {
  category: 'Components',
  subtitle: '时间选择框',
  type: 'Data Entry',
  title: 'TimePicker',
  render() {
    return (
      <div id="components-timepicker-demo">
        <md cn={md.cn} us={md.us} />
        <demo-sort>
          <Hours />
          <Addon />
          <Basic />
          <Disabled />
          <HideColumn />
          <IntervalOptions />
          <Size />
          <Value />
          <Suffix />
        </demo-sort>
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
<style>
#components-timepicker-demo .ant-time-picker {
  margin: 0 8px 12px 0;
}
</style>
