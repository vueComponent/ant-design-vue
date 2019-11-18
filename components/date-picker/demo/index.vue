<script>
import Basic from './basic';
import DateRender from './date-render';
import DisabledDate from './disabled-date';
import Disabled from './disabled';
import ExtraFooter from './extra-footer';
import Format from './format';
import Mode from './mode';
import PresettedRanges from './presetted-ranges';
import Size from './size';
import StartEnd from './start-end';
import Time from './time';
import Suffix from './suffix';
import Text from './text';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# DatePicker 日期选择框
          输入或选择日期的控件。
## 何时使用
当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。
          ## 代码演示`,
  us: `# DatePicker
          To select or input a date.
## When To Use
By clicking the input box, you can select a date from a popup calendar.
## Examples
          `,
};
export default {
  category: 'Components',
  type: 'Data Entry',
  zhType: '数据录入',
  title: 'DatePicker',
  subtitle: '日期选择框',
  render() {
    return (
      <div id="components-date-picker-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <DateRender />
        <DisabledDate />
        <Disabled />
        <ExtraFooter />
        <Format />
        <Mode />
        <PresettedRanges />
        <Size />
        <StartEnd />
        <Time />
        <Text />
        <Suffix />
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
#components-date-picker-demo .ant-calendar-picker {
  margin: 0 8px 12px 0;
}
</style>
