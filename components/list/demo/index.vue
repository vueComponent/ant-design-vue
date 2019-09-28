<script>
import Basic from './basic';
import Grid from './grid';
import InfiniteLoad from './infinite-load';
import InfiniteVirtualizedLoad from './infinite-virtualized-load';
import Loadmore from './loadmore';
import Resposive from './resposive';
import Simple from './simple';
import Vertical from './vertical';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 列表
  通用列表。
## 何时使用
最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。
        ## 代码演示`,
  us: `# List
  Simple List.

## When To Use

A list can be used to display content related to a single subject. The content can consist of multiple elements of varying type and size.
  ## Examples
  `,
};
export default {
  category: 'Components',
  type: 'Data Display',
  title: 'List',
  subtitle: '列表',
  cols: 1,
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Grid />
        <Loadmore />
        <Resposive />
        <Simple />
        <Vertical />
        <InfiniteLoad />
        <InfiniteVirtualizedLoad />
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
