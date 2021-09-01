<template>
  <demo-sort>
    <basic />
    <size />
    <disabled />
    <digit />
    <formatter />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Disabled from './disabled.vue';
import Digit from './digit.vue';
import Formatter from './formatter.vue';
import Size from './size.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Disabled,
    Digit,
    Formatter,
    Size,
  },
});
</script>
