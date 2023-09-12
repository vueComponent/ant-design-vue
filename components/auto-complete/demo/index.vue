<template>
  <demo-sort>
    <basic />
    <options />
    <custom />
    <non-case-sensitive />
    <certain-category />
    <uncertain-category />
    <statusVue />
    <border-less />
    <allow-clear />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Options from './options.vue';
import Custom from './custom.vue';
import NonCaseSensitive from './non-case-sensitive.vue';
import CertainCategory from './certain-category.vue';
import UncertainCategory from './uncertain-category.vue';
import statusVue from './status.vue';
import BorderLess from './border-less.vue';
import AllowClear from './allow-clear.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    statusVue,
    Basic,
    Options,
    Custom,
    NonCaseSensitive,
    CertainCategory,
    UncertainCategory,
    BorderLess,
    AllowClear,
  },
  setup() {
    return {};
  },
});
</script>
