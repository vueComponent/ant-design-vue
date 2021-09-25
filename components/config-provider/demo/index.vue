<template>
  <demo-sort :cols="1">
    <Locale />
  </demo-sort>
</template>

<script>
import Locale from './locale.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Locale,
  },
});
</script>
