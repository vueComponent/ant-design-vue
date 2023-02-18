<script lang="ts">
import { defineComponent } from 'vue';
import Basic from './basic.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
  },
});
</script>

<template>
  <demo-sort>
    <Basic />
  </demo-sort>
</template>
