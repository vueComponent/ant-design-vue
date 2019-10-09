<script>
import Basic from './basic.md';
import Active from './active.md';
import Children from './children.md';
import Complex from './complex.md';
import List from './list.md';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 加载占位图

  在需要等待加载内容的位置提供一个占位图。

  ## 何时使用

  - 网络较慢，需要长时间等待加载处理的情况下。
  - 图文信息内容较多的列表/卡片中。
            ## 代码演示`,
  us: `# Skeleton

  Provide a placeholder at the place which need waiting for loading.

  # When To Use

  - When resource needs long time to load, like low network speed.
  - The component contains much information. Such as List or Card.
  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '加载占位图',
  type: 'Feedback',
  title: 'Skeleton',
  cols: 1,
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <br />
        <Basic />
        <br />
        <Complex />
        <br />
        <Active />
        <br />
        <Children />
        <br />
        <List />
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
