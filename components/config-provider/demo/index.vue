<template>
  <demo-sort :cols="1">
    <Locale />
    <Size />
    <Theme />
  </demo-sort>
</template>

<script>
import Locale from './locale.vue';
import Size from './size.vue';
import Theme from './theme.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Locale,
    Size,
    Theme,
  },
});
</script>
