<script>
import BasicControlled from './basic-controlled';
import Basic from './basic';
import CustomizedIcon from './customized-icon';
import Draggable from './draggable';
import Dynamic from './dynamic';
import Line from './line';
import Search from './search';
import Directory from './directory';
import ReplaceFields from './replaceFields';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 树形控件
  ## 何时使用

文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用\`树控件\`可以完整展现其中的层级关系，并具有展开收起选择等交互功能。

        ## 代码演示`,
  us: `# Tree
  ## When To Use

Almost anything can be represented in a tree structure.
Examples include directories, organization hierarchies, biological classifications, countries, etc. The \`Tree\` component is a way of representing the hierarchical relationship between these things. You can also  expand, collapse, and select a treeNode within a \`Tree\`.
## Examples
  `,
};
export default {
  category: 'Components',
  type: 'Data Display',
  title: 'Tree',
  subtitle: '树形控件',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <BasicControlled />
        <Basic />
        <ReplaceFields />
        <CustomizedIcon />
        <Draggable />
        <Dynamic />
        <Line />
        <Search />
        <Directory />
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
