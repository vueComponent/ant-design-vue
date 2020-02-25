<script>
import Basic from './basic.md';
import Color from './color.md';
import Pending from './pending.md';
import Custom from './custom.md';
import Alternate from './alternate';
import Right from './right';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 时间轴
  垂直展示的时间流信息。
  ## 何时使用
  - 当有一系列信息需按时间排列时，可正序和倒序。
  - 需要有一条时间轴进行视觉上的串联时。
        ## 代码演示`,
  us: `# Timeline
  Vertical display timeline.
  ## When To Use
  - When a series of information needs to be ordered by time (ascending or descending).
  - When you need a timeline to make a visual connection.
  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '时间轴',
  type: 'Data Display',
  title: 'Timeline',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Color />
        <Pending />
        <Custom />
        <Alternate />
        <Right />
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
