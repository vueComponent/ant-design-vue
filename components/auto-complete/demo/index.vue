<template>
  <demo-sort>
    <basic />
    <options />
    <custom />
    <non-case-sensitive />
    <certain-category />
    <uncertain-category />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Options from './options.vue';
import Custom from './custom.vue';
import NonCaseSensitive from './non-case-sensitive.vue';
import CertainCategory from './certain-category.vue';
import UncertainCategory from './uncertain-category.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Options,
    Custom,
    NonCaseSensitive,
    CertainCategory,
    UncertainCategory,
  },
  setup() {
    return {};
  },
});
</script>
