<template>
  <demo-sort>
    <basic />
    <unit />
    <card />
    <countdown />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Unit from './unit.vue';
import Card from './card.vue';
import Countdown from './countdown.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Unit,
    Card,
    Countdown,
  },
  setup() {
    return {};
  },
});
</script>
