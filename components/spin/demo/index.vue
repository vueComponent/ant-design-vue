<script>
import CustomIndicator from './custom-indicator';
import Basic from './basic';
import DelayAndDebounce from './delayAndDebounce';
import Inside from './inside';
import Nested from './nested';
import Size from './size';
import Tip from './tip';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Spin 加载中

  用于页面和区块的加载中状态。

  ## 何时使用

  页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。
            ## 代码演示`,
  us: `# Spin

  A spinner for displaying loading state of a page or a section.

  # When To Use

  When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.
  ## Examples `,
};
export default {
  category: 'Components',
  type: 'Feedback',
  title: 'Spin',
  subtitle: '加载中',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Size />
        <Inside />
        <Nested />
        <Tip />
        <DelayAndDebounce />
        <CustomIndicator />
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
