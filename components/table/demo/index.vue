<script>
import Ajax from './ajax.md';
import Basic from './basic.md';
import Bordered from './bordered.md';
import ColspanRowspan from './colspan-rowspan.md';
import CustomFilterPanel from './custom-filter-panel.md';
import EditCell from './edit-cell.md';
import EditRow from './edit-row.md';
import ExpandChildren from './expand-children.md';
import Expand from './expand.md';
import FixedColumnsHeader from './fixed-columns-header.md';
import FixedColumns from './fixed-columns.md';
import FixedHeader from './fixed-header.md';
import GroupingColumns from './grouping-columns.md';
import Head from './head.md';
import NestedTable from './nested-table.md';
import ResetFilter from './reset-filter.md';
import RowSelectionAndOperation from './row-selection-and-operation.md';
import RowSelectionCustom from './row-selection-custom.md';
import RowSelection from './row-selection.md';
import Size from './size.md';
import Template from './template.md';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Table 表格

    展示行列数据。

## 何时使用

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 如何使用

指定表格的数据源 \`dataSource\` 为一个数组。
    ## 代码演示`,
  us: `# Table

    A table displays rows of data.

## When To Use

- To display a collection of structured data.
- To sort, search, paginate, filter data.

## How To Use

Specify \`dataSource\` of Table as an array of data.
## Examples
`,
};
export default {
  category: 'Components',
  cols: 1,
  type: 'Data Display',
  title: 'Table',
  subtitle: '表格',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Ajax />
        <Basic />
        <Bordered />
        <ColspanRowspan />
        <CustomFilterPanel />
        <EditCell />
        <EditRow />
        <ExpandChildren />
        <Expand />
        <FixedColumnsHeader />
        <FixedColumns />
        <FixedHeader />
        <GroupingColumns />
        <Head />
        <NestedTable />
        <ResetFilter />
        <RowSelectionAndOperation />
        <RowSelectionCustom />
        <RowSelection />
        <Size />
        <Template />
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
