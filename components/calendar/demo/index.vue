<script>
import Basic from './basic';
import Card from './card';
import NoticeCalendar from './notice-calendar';
import Select from './select';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Calendar 日历
          
按照日历形式展示数据的容器。

## 何时使用

当数据是日期或按照日期划分时，例如日程、课表、价格日历等，农历等。目前支持年/月切换。

          ## 代码演示`,
  us: `# Calendar
          
Container for displaying data in calendar form.

## When To Use

When data is in the form of dates, such as schedules, timetables, prices calendar, lunar calendar. This component also supports Year/Month switch.
## Examples 
`,
};
export default {
  category: 'Components',
  type: 'Data Display',
  zhType: '数据展示',
  subtitle: '日历',
  cols: 1,
  title: 'Calendar',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Card />
        <NoticeCalendar />
        <Select />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
