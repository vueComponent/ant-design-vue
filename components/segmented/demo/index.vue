<template>
  <demo-sort>
    <basic />
    <block />
    <disabled />
    <controlled />
    <custom />
    <dynamic />
    <size />
    <icon />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Block from './block.vue';
import Disabled from './disabled.vue';
import Controlled from './controlled.vue';
import Custom from './custom.vue';
import Dynamic from './dynamic.vue';
import Size from './size.vue';
import Icon from './icon.vue';

export default defineComponent({
  components: { Icon, Size, Dynamic, Custom, Controlled, Disabled, Block, Basic },
  category: 'Components',
  subtitle: '分段控制器',
  type: 'Data Display',
  title: 'Segmented',
  CN,
  US,
});
</script>
