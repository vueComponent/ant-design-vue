<script>
import Basic from './basic';
import Checkable from './checkable';
import Multiple from './multiple';
import TreeData from './treeData';
import Suffix from './suffix';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 树型选择控件。
  ## 何时使用

类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 TreeSelect，例如公司层级、学科系统、分类目录等等。

        ## 代码演示`,
  us: `# TreeSelect
  ## When To Use

\`TreeSelect\` is similar to \`Select\`, but the values are provided in a tree like structure.
Any data whose entries are defined in a hierarchical manner is fit to use this control. Examples of such case may include a corporate hierarchy, a directory structure, and so on.
## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '树选择',
  type: 'Data Entry',
  title: 'TreeSelect',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Checkable />
        <Multiple />
        <TreeData />
        <Suffix />
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
