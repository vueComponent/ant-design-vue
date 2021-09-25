<template>
  <demo-sort :cols="1">
    <Basic />
    <Ajax />
    <Bordered />
    <Ellipsis />
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
    <MultipleSorter />
    <NestedTable />
    <ResetFilter />
    <RowSelectionAndOperation />
    <RowSelectionCustom />
    <RowSelection />
    <Size />
    <Stripe />
    <Summary />
    <TemplateCom />
  </demo-sort>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import Ajax from './ajax.vue';
import Basic from './basic.vue';
import Bordered from './bordered.vue';
import ColspanRowspan from './colspan-rowspan.vue';
import CustomFilterPanel from './custom-filter-panel.vue';
import EditCell from './edit-cell.vue';
import EditRow from './edit-row.vue';
import ExpandChildren from './expand-children.vue';
import Expand from './expand.vue';
import FixedColumnsHeader from './fixed-columns-header.vue';
import FixedColumns from './fixed-columns.vue';
import FixedHeader from './fixed-header.vue';
import GroupingColumns from './grouping-columns.vue';
import Head from './head.vue';
import NestedTable from './nested-table.vue';
import ResetFilter from './reset-filter.vue';
import RowSelectionAndOperation from './row-selection-and-operation.vue';
import RowSelectionCustom from './row-selection-custom.vue';
import RowSelection from './row-selection.vue';
import Size from './size.vue';
import TemplateCom from './template.vue';
import Ellipsis from './ellipsis.vue';
import Stripe from './stripe.vue';
import MultipleSorter from './multiple-sorter.vue';
import Summary from './summary.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Ellipsis,
    Ajax,
    Bordered,
    ColspanRowspan,
    CustomFilterPanel,
    EditCell,
    EditRow,
    ExpandChildren,
    Expand,
    FixedColumnsHeader,
    FixedColumns,
    FixedHeader,
    GroupingColumns,
    Head,
    NestedTable,
    ResetFilter,
    RowSelectionAndOperation,
    RowSelectionCustom,
    RowSelection,
    Size,
    TemplateCom,
    Stripe,
    MultipleSorter,
    Summary,
  },
});
</script>
