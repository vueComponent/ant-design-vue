<script>
import Basic from './basic';
import CertainCategory from './certain-category';
import Custom from './custom';
import NonCaseSensitive from './non-case-sensitive';
import Options from './options';
import UncertainCategory from './uncertain-category';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# AutoComplete 自动完成
          输入框自动完成功能。
## 何时使用
需要自动完成时。
          ## 代码演示`,
  us: `# AutoComplete
        Autocomplete function of input field.
## When To Use
When there is a need for autocomplete functionality.
## Examples
`,
};
export default {
  category: 'Components',
  subtitle: '自动完成',
  type: 'Data Entry',
  zhType: '数据录入',
  cols: 2,
  title: 'AutoComplete',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <CertainCategory />
        <Custom />
        <NonCaseSensitive />
        <Options />
        <UncertainCategory />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
