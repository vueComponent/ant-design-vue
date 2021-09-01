<template>
  <demo-sort :cols="1">
    <basic />
    <flex-align />
    <flex-order />
    <flex-stretch />
    <flex />
    <gutter />
    <offset />
    <ResponsiveMore />
    <responsive />
    <sort />
    <playfround />
  </demo-sort>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Basic from './basic.vue';
import FlexAlign from './flex-align.vue';
import FlexOrder from './flex-order.vue';
import FlexStretch from './flex-stretch.vue';
import Flex from './flex.vue';
import Gutter from './gutter.vue';
import Offset from './offset.vue';
import ResponsiveMore from './responsive-more.vue';
import Responsive from './responsive.vue';
import Sort from './sort.vue';
import Playfround from './playfround.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    FlexAlign,
    FlexOrder,
    FlexStretch,
    Flex,
    Gutter,
    Offset,
    ResponsiveMore,
    Responsive,
    Sort,
    Playfround,
  },
});
</script>
