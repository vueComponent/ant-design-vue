<script>
import CustomizedProgressDot from './customized-progress-dot';
import Error from './error';
import Icon from './icon';
import ProgressDot from './progress-dot';
import Simple from './simple';
import SmallSize from './small-size';
import StepNext from './step-next';
import VerticalSmall from './vertical-small';
import Vertical from './vertical';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Steps

  引导用户按照流程完成任务的导航条。

  ## 何时使用

  当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。
            ## 代码演示`,
  us: `# Steps

  'Steps' is a navigation bar that guides users through the steps of a task.

  # When To Use

  When the task is complicated or has a certain sequence in the series of subtasks, we can decompose it into several steps to make things easier.
  ## Examples 
  `,
};
export default {
  category: 'Components',
  subtitle: '步骤条',
  type: 'Navigation',
  cols: 1,
  title: 'Steps',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Simple />
        <br />
        <SmallSize />
        <br />
        <Icon />
        <br />
        <StepNext />
        <br />
        <Vertical />
        <br />
        <VerticalSmall />
        <br />
        <Error />
        <br />
        <ProgressDot />
        <br />
        <CustomizedProgressDot />
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
