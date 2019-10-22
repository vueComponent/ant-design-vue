<script>
import Basic from './basic';
import ChangeOnSelect from './change-on-select';
import CustomRender from './custom-render';
import CustomTrigger from './custom-trigger';
import DefaultValue from './default-value';
import DisabledOption from './disabled-option';
import Hover from './hover';
import Lazy from './lazy';
import Search from './search';
import Size from './size';
import FieldsName from './fields-name';
import Suffix from './suffix';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Cascader 级联选择
          级联选择框。
## 何时使用
- 需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。
- 从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择。
- 比起 Select 组件，可以在同一个浮层中完成选择，有较好的体验。
          ## 代码演示`,
  us: `# Cascader
          Cascade selection box.
## When To Use
- When you need to select from a set of associated data set. Such as province/city/district, company level, things classification.
- When selecting from a large data set, with multi-stage classification separated for easy selection.
- Chooses cascade items in one float layer for better user experience.
## Examples
          `,
};
export default {
  category: 'Components',
  type: 'Data Entry',
  zhType: '数据录入',
  title: 'Cascader',
  subtitle: '级联选择',
  render() {
    return (
      <div id="components-cascader-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <ChangeOnSelect />
        <CustomRender />
        <CustomTrigger />
        <DefaultValue />
        <DisabledOption />
        <Hover />
        <Lazy />
        <Search />
        <Size />
        <FieldsName />
        <Suffix />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
<style>
#components-cascader-demo .ant-cascader-picker {
  width: 300px;
}
</style>
