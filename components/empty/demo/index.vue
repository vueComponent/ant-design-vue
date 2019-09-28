<script>
import Basic from './basic';
import ConfigProvider from './config-provider';
import Customize from './customize';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

import '../style';

const md = {
  cn: `# 空状态
        空状态时的展示占位图。

      空状态时的展示占位图。

      ## 何时使用

      当目前没有数据时，用于显式的用户提示。

       ## 代码演示
        `,
  us: `# Empty
        Empty state placeholder.

        ## When To Use

        When there is no data provided, display for friendly tips.
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
        <Basic />
        <ConfigProvider />
        <Customize />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
