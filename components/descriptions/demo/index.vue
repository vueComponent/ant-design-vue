<template>
  <demo-sort :cols="1">
    <Basic />
    <Border />
    <Size />
    <Responsive />
    <Vertical />
    <VerticalBorder />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Border from './border.vue';
import Responsive from './responsive.vue';
import Size from './size.vue';
import VerticalBorder from './vertical-border.vue';
import Vertical from './vertical.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  category: 'Components',
  type: 'Data Display',
  zhType: '数据展示',
  title: 'Descriptions',
  subtitle: '描述列表',
  cols: 1,
  CN,
  US,
  components: {
    Basic,
    Border,
    Size,
    Responsive,
    Vertical,
    VerticalBorder,
  },
});
</script>
