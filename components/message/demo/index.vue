<script>
import Duration from './duration';
import Info from './info';
import Loading from './loading';
import Other from './other';
import Thenable from './thenable';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# 全局提示
全局展示操作反馈信息。
## 何时使用
- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

## 代码演示`,
  us: `# Message
Display global messages as feedback in response to user operations.
## When To Use
- To provide feedback such as success, warning, error etc.
- A message is displayed at top and center and will be dismissed automatically, as a non-interrupting light-weighted prompt.
## Examples `,
};
export default {
  category: 'Components',
  subtitle: '全局提示',
  type: 'Feedback',
  noinstant: true,
  title: 'Message',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Info />
        <Duration />
        <Loading />
        <Other />
        <Thenable />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
