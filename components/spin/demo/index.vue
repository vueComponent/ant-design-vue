<template>
  <demo-sort>
    <basic />
    <size />
    <inside />
    <nested />
    <tip />
    <delay />
    <custom-indicator />
    <fullscreen />
    <percent />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Size from './size.vue';
import Inside from './inside.vue';
import Nested from './nested.vue';
import Tip from './tip.vue';
import Delay from './delay.vue';
import Fullscreen from './fullscreen.vue';
import Percent from './percent.vue';
import CustomIndicator from './custom-indicator.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Size,
    Inside,
    Nested,
    Tip,
    Delay,
    CustomIndicator,
    Fullscreen,
    Percent,
  },
  setup() {
    return {};
  },
});
</script>
