<script>
import Basic from './basic';
import ConfigProvider from './config-provider';
import Customize from './customize';
import Description from './description';
import Simple from './simple';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 空状态
        空状态时的展示占位图。

      空状态时的展示占位图。

      ## 何时使用

      - 当目前没有数据时，用于显式的用户提示。
      - 初始化场景时的引导创建流程。

       ## 代码演示
        `,
  us: `# Empty
        Empty state placeholder.

        ## When To Use

        - When there is no data provided, display for friendly tips.
        - User tutorial to create something in fresh new situation.
       ## Examples
        `,
};
export default {
  category: 'Components',
  type: 'Data Display',
  title: 'Empty',
  subtitle: '空状态',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <demo-sort cols={1}>
          <Basic />
          <ConfigProvider />
          <Customize />
          <Description />
          <Simple />
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
