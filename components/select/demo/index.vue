<template>
  <demo-sort>
    <Basic />
    <Size />
    <Tags />
    <Responsive />
    <AutomaticTokenization />
    <LabelInValue />
    <Multiple />
    <Coordinate />
    <Optgroup />
    <SearchBox />
    <Search />
    <SelectUsers />
    <Suffix />
    <HideSelected />
    <CustomDropdownMenu />
    <OptionLabelProp />
    <BigData />
    <fieldNamesVue />
    <placementVue />
    <statusVue />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Size from './size.vue';
import Tags from './tags.vue';
import AutomaticTokenization from './automatic-tokenization.vue';
import LabelInValue from './label-in-value.vue';
import Multiple from './multiple.vue';
import Coordinate from './coordinate.vue';
import Optgroup from './optgroup.vue';
import SearchBox from './search-box.vue';
import Search from './search.vue';
import SelectUsers from './select-users.vue';
import Suffix from './suffix.vue';
import HideSelected from './hide-selected.vue';
import CustomDropdownMenu from './custom-dropdown-menu.vue';
import OptionLabelProp from './option-label-prop.vue';
import BigData from './big-data.vue';
import Responsive from './responsive.vue';
import fieldNamesVue from './field-names.vue';
import placementVue from './placement.vue';
import statusVue from './status.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    placementVue,
    statusVue,
    fieldNamesVue,
    Basic,
    Size,
    Tags,
    AutomaticTokenization,
    LabelInValue,
    Multiple,
    Coordinate,
    Optgroup,
    SearchBox,
    Search,
    SelectUsers,
    Suffix,
    HideSelected,
    CustomDropdownMenu,
    OptionLabelProp,
    BigData,
    Responsive,
  },
  setup() {
    return {};
  },
});
</script>

<style>
#components-select-demo .ant-select {
  margin: 0 8px 10px 0;
}
</style>
