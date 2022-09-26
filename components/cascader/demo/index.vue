<template>
  <demo-sort>
    <basic />
    <custom-trigger />
    <hover />
    <disabled-option />
    <change-on-select />
    <size />
    <custom-render />
    <search />
    <lazy />
    <fields-name />
    <suffix />
    <multipleVue />
    <tagRender />
  </demo-sort>
</template>
<script>
import Basic from './basic.vue';
import ChangeOnSelect from './change-on-select.vue';
import CustomRender from './custom-render.vue';
import CustomTrigger from './custom-trigger.vue';
import DisabledOption from './disabled-option.vue';
import Hover from './hover.vue';
import Lazy from './lazy.vue';
import Search from './search.vue';
import Size from './size.vue';
import FieldsName from './fields-name.vue';
import Suffix from './suffix.vue';
import multipleVue from './multiple.vue';
import tagRender from './tagRender.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    ChangeOnSelect,
    CustomRender,
    CustomTrigger,
    DisabledOption,
    Hover,
    Lazy,
    Search,
    Size,
    FieldsName,
    Suffix,
    multipleVue,
    tagRender,
  },
});
</script>
<style>
#components-cascader-demo .ant-cascader-picker {
  width: 300px;
}
</style>
