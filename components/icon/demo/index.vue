<template>
  <icon-display />
  <demo-sort>
    <basic />
    <twotone />
    <custom />
    <iconfont />
  </demo-sort>
</template>

<script lang="ts">
import IconDisplay from '../../../site/src/theme/template/IconDisplay';
import Basic from './basic.vue';
import Custom from './custom.vue';
import Iconfont from './iconfont.vue';
import Twotone from './two-tone.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    IconDisplay,
    Basic,
    Custom,
    Iconfont,
    Twotone,
  },
});
</script>
