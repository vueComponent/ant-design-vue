<script>
import Basic from './basic';
import Card from './card';
import Unit from './unit';
import Countdown from './countdown';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Statistic 统计数值
          展示统计数值。
          ## 何时使用
            - 当需要突出某个或某组数字时
            - 当需要展示带描述的统计类数据时使用

          ## 代码演示`,
  us: `# Statistic
          Statistics can be used to represent people or objects. It supports images, 'Icon's, or letters.
          ## Examples
          `,
};
export default {
  category: 'Components',
  subtitle: '统计数值',
  type: 'Data Display',
  zhType: '数据展示',
  title: 'Statistic',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <br />
        <Unit />
        <br />
        <Card />
        <br />
        <Countdown />
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
