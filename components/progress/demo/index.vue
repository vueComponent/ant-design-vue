<script>
import Line from './line.md';
import Circle from './circle.md';
import LineMini from './line-mini.md';
import CircleMini from './circle-mini.md';
import CircleDynamic from './circle-dynamic.md';
import Format from './format.md';
import Dynamic from './dynamic.md';
import Dashboard from './dashboard.md';
import Segment from './segment.md';
import Linecap from './linecap.md';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Progress 进度条
  展示操作的当前进度。
  ## 何时使用
  在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。

  - 当一个操作会打断当前界面，或者需要在后台运行，且耗时可能超过2秒时；
  - 当需要显示一个操作完成的百分比时。
        ## 代码演示`,
  us: `# Progress
  Display the current progress of an operation flow.
  ## When To Use
  If it will take a long time to complete an operation, you can use \`Progress\` to show the current progress and status.

  - When an operation will interrupt the current interface, or it needs to run in the background for more than 2 seconds.
  - When you need to display the completion percentage of an operation.
  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '进度条',
  type: 'Feedback',
  title: 'Progress',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <br />
        <Line />
        <br />
        <Circle />
        <br />
        <LineMini />
        <br />
        <CircleMini />
        <br />
        <CircleDynamic />
        <br />
        <Format />
        <br />
        <Dynamic />
        <br />
        <Dashboard />
        <br />
        <Segment />
        <br />
        <Linecap />
        <br />
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
